import AbstractSpruceError from '@sprucelabs/error'
import {
	EmitCallback,
	EventContract,
	EventNames,
	EventSignature,
	MercuryAggregateResponse,
	MercurySingleResponse,
	SpruceSchemas,
} from '@sprucelabs/mercury-types'
import { Schema, SchemaValues, validateSchemaValues } from '@sprucelabs/schema'
import {
	eventContractUtil,
	eventResponseUtil,
	eventNameUtil,
} from '@sprucelabs/spruce-event-utils'
import io, { Socket, SocketOptions, ManagerOptions } from 'socket.io-client'
import SpruceError from '../errors/SpruceError'
import { MercuryClient } from '../types/client.types'
import socketIoEventUtil from '../utilities/socketIoEventUtil.utility'

type IoOptions = Partial<ManagerOptions & SocketOptions>

export default class MercurySocketIoClient<Contract extends EventContract>
	implements MercuryClient<Contract>
{
	protected eventContract?: Contract

	private host: string
	private ioOptions: IoOptions
	private socket?: Socket
	private emitTimeoutMs: number
	private reconnectDelayMs: number
	private isReAuthing = false
	private lastAuthOptions?: {
		skillId?: string | undefined
		apiKey?: string | undefined
		token?: string | undefined
	}
	private shouldReconnect: boolean
	private registeredListeners: any[] = []
	private allowNextEventToBeAuthenticate = false
	protected auth?: {
		skill?: SpruceSchemas.Spruce.v2020_07_22.Skill
		person?: SpruceSchemas.Spruce.v2020_07_22.Person
	}
	private shouldAutoRegisterListeners = true

	public constructor(
		options: {
			host: string
			eventContract?: Contract
			emitTimeoutMs?: number
			reconnectDelayMs?: number
			shouldReconnect?: boolean
		} & IoOptions
	) {
		const {
			host,
			eventContract,
			emitTimeoutMs,
			reconnectDelayMs,
			shouldReconnect,
			...ioOptions
		} = options

		this.host = host
		this.ioOptions = { ...ioOptions, withCredentials: false }
		this.eventContract = eventContract
		this.emitTimeoutMs = emitTimeoutMs ?? 30000
		this.reconnectDelayMs = reconnectDelayMs ?? 5000
		this.shouldReconnect = shouldReconnect ?? true
	}

	public async connect() {
		this.socket = io(this.host, this.ioOptions)

		await new Promise((resolve, reject) => {
			this.socket?.on('connect', () => {
				//@ts-ignore
				this.socket?.removeAllListeners()

				if (this.shouldReconnect) {
					this.socket?.once('disconnect', async () => {
						this.attemptReconnectAfterDelay()
					})
				}

				resolve(undefined)
			})

			this.socket?.on('timeout', () => {
				reject(
					new SpruceError({
						code: 'TIMEOUT',
						eventName: 'connect',
						timeoutMs: 20000,
						friendlyMessage: `Uh Oh! I'm having trouble reaching HQ! Double check you have good internet and try again. In the meantime I'll try some things on my side and see what I can do. 🤞`,
					})
				)
			})

			this.socket?.on('connect_error', (err: Record<string, any>) => {
				const error = this.mapSocketErrorToSpruceError(err)
				//@ts-ignore
				this.socket?.removeAllListeners()

				reject(error)
			})
		})
	}

	private attemptReconnectAfterDelay() {
		if (this.lastAuthOptions) {
			this.isReAuthing = true
		}

		setTimeout(async () => {
			try {
				await this.connect()

				if (this.lastAuthOptions) {
					await this.authenticate(this.lastAuthOptions)
				}

				await this.reregisterAllListeners()

				this.isReAuthing = false
			} catch (err) {
				if (
					err.options.code === 'TIMEOUT' ||
					err.options.code === 'CONNECTION_FAILED'
				) {
					this.attemptReconnectAfterDelay()
				} else {
					console.log(err.message)
					this.lastAuthOptions = undefined
				}
			}
		}, this.reconnectDelayMs)
	}

	private async reregisterAllListeners() {
		const listeners = this.registeredListeners
		this.registeredListeners = []
		const all = Promise.all(
			listeners.map((listener) => this.on(listener[0], listener[1]))
		)

		await all
	}

	private mapSocketErrorToSpruceError(err: Record<string, any>) {
		const originalError = new Error(err.message ?? err)
		if (err.stack) {
			originalError.stack = err.stack
		}

		//@ts-ignore
		originalError.socketError = err

		switch (err.message) {
			case 'timeout':
				return new SpruceError({
					code: 'TIMEOUT',
					eventName: 'connect',
					timeoutMs: 10000,
				})
			case 'xhr poll error':
				return new SpruceError({
					code: 'CONNECTION_FAILED',
					host: this.host,
					statusCode: +err.description || 503,
					originalError,
				})
			default:
				return new SpruceError({
					code: 'UNKNOWN_ERROR',
					originalError,
					friendlyMessage: `Something went wrong when working with socketio`,
				})
		}
	}

	public async emit<
		EventName extends EventNames<Contract>,
		IEventSignature extends EventSignature = Contract['eventSignatures'][EventName],
		EmitSchema extends Schema = IEventSignature['emitPayloadSchema'] extends Schema
			? IEventSignature['emitPayloadSchema']
			: never,
		ResponseSchema extends Schema = IEventSignature['responsePayloadSchema'] extends Schema
			? IEventSignature['responsePayloadSchema']
			: never,
		ResponsePayload = ResponseSchema extends Schema
			? SchemaValues<ResponseSchema>
			: never
	>(
		eventName: EventName,
		payload?:
			| (EmitSchema extends SchemaValues<EmitSchema>
					? SchemaValues<EmitSchema>
					: never)
			| EmitCallback<Contract, EventName>,
		cb?: EmitCallback<Contract, EventName>
	): Promise<MercuryAggregateResponse<ResponsePayload>> {
		if (
			!this.allowNextEventToBeAuthenticate &&
			eventName === 'authenticate::v2020_12_25'
		) {
			throw new SpruceError({
				code: 'INVALID_PARAMETERS',
				parameters: ['eventName'],
				friendlyMessage: `You can't emit this event directly. Use client.authenticate() so all your auth is preseved.`,
			})
		}

		this.allowNextEventToBeAuthenticate = false

		const signature = this.getEventSignatureByName(eventName)

		if (!this.isSocketConnected()) {
			throw new SpruceError({ code: 'NOT_CONNECTED', action: 'emit' })
		}

		if (signature.emitPayloadSchema) {
			try {
				validateSchemaValues(
					signature.emitPayloadSchema as Schema,
					payload ?? {}
				)
			} catch (err) {
				throw new SpruceError({
					code: 'INVALID_PAYLOAD',
					originalError: err,
					eventName,
				})
			}
		} else if (payload && this.eventContract) {
			throw new SpruceError({
				code: 'UNEXPECTED_PAYLOAD',
				eventName,
			})
		}

		const responseEventName = eventNameUtil.generateResponseEventName(eventName)

		const singleResponseHandler = (
			response: MercurySingleResponse<ResponsePayload>
		) => {
			void cb?.(
				eventResponseUtil.mutatingMapSingleResonseErrorsToSpruceErrors(
					response,
					SpruceError
				) as any
			)
		}

		if (cb) {
			this.socket?.on(responseEventName, singleResponseHandler)
		}

		const args: any[] = []

		if (payload) {
			args.push(payload)
		}

		const results: MercuryAggregateResponse<ResponsePayload> =
			await new Promise((resolve, reject) => {
				try {
					const emitTimeout = setTimeout(() => {
						this.socket?.off(responseEventName)
						reject(
							new SpruceError({
								code: 'TIMEOUT',
								eventName,
								timeoutMs: this.emitTimeoutMs,
								isConnected: this.isSocketConnected(),
							})
						)
					}, this.emitTimeoutMs)

					args.push((results: any) => {
						clearTimeout(emitTimeout)
						this.handleConfirmPinResponse(eventName, results)
						this.socket?.off(responseEventName, singleResponseHandler)

						resolve(results)
					})

					const ioName = socketIoEventUtil.toSocketName(eventName)

					this.socket?.emit(ioName, ...args)
				} catch (err) {
					reject(err)
				}
			})

		return eventResponseUtil.mutatingMapAggregateResponseErrorsToSpruceErrors(
			results,
			SpruceError
		)
	}
	private handleConfirmPinResponse(eventName: string, results: any) {
		const payload = results?.responses?.[0]?.payload
		if (eventName.search('confirm-pin') === 0 && payload?.person) {
			this.lastAuthOptions = { token: payload.token }
			this.auth = {
				person: payload.person,
			}
		}
	}

	protected getEventSignatureByName<EventName extends EventNames<Contract>>(
		eventName: EventName
	) {
		if (!this.eventContract) {
			return {}
		}

		return eventContractUtil.getSignatureByName(
			this.eventContract,
			eventName
		) as EventSignature
	}

	public setShouldAutoRegisterListeners(should: boolean) {
		this.shouldAutoRegisterListeners = should
	}

	public async on<
		EventName extends EventNames<Contract>,
		IEventSignature extends EventSignature = Contract['eventSignatures'][EventName],
		EmitSchema extends Schema = IEventSignature['emitPayloadSchema'] extends Schema
			? IEventSignature['emitPayloadSchema']
			: never
	>(
		eventName: EventName,
		cb: (
			payload: EmitSchema extends Schema ? SchemaValues<EmitSchema> : never
		) => IEventSignature['responsePayloadSchema'] extends Schema
			?
					| Promise<SchemaValues<IEventSignature['responsePayloadSchema']>>
					| SchemaValues<IEventSignature['responsePayloadSchema']>
			: Promise<void> | void
	) {
		this.registeredListeners.push([eventName, cb])

		if (this.shouldAutoRegisterListeners) {
			//@ts-ignore
			const results = await this.emit('register-listeners::v2020_12_25', {
				payload: { fullyQualifiedEventNames: [eventName] },
			})

			if (results.totalErrors > 0) {
				const options = results.responses[0].errors?.[0] ?? 'UNKNOWN_ERROR'
				throw AbstractSpruceError.parse(options, SpruceError)
			}
		}

		this.socket?.on(
			eventName,
			//@ts-ignore
			async (targetAndPayload: any, ioCallback: (p: any) => void) => {
				if (cb) {
					try {
						const results = await cb(targetAndPayload)
						if (ioCallback) {
							ioCallback(results)
						}
					} catch (err) {
						let thisErr = err
						if (ioCallback) {
							if (!(err instanceof AbstractSpruceError)) {
								thisErr = new SpruceError({
									//@ts-ignore
									code: 'LISTENER_ERROR',
									friendlyMessage: err.message,
									originalError: err,
								})
							}
							ioCallback({ errors: [thisErr] })
						}
					}
				}
			}
		)
	}

	public async off(eventName: EventNames<Contract>): Promise<number> {
		return new Promise((resolve, reject) => {
			this.socket?.emit(
				'unregister-listeners::v2020_12_25',
				{
					payload: {
						fullyQualifiedEventNames: [eventName],
					},
				},
				(results: any) => {
					if (results.totalErrors > 0) {
						const err = AbstractSpruceError.parse(
							results.responses[0].errors[0],
							SpruceError
						)
						reject(err)
					} else {
						resolve(results.responses[0].payload.unregisterCount)
					}
				}
			)
		})
	}

	public async disconnect() {
		if (this.isSocketConnected()) {
			//@ts-ignore
			this.socket?.removeAllListeners()

			await new Promise((resolve) => {
				this.socket?.once('disconnect', () => {
					this.socket = undefined
					resolve(undefined)
				})

				this.socket?.disconnect()
			})
		}
		return
	}

	public async authenticate(options: {
		skillId?: string
		apiKey?: string
		token?: string
	}) {
		const { skillId, apiKey, token } = options

		this.lastAuthOptions = options
		this.allowNextEventToBeAuthenticate = true

		//@ts-ignore
		const results = await this.emit('authenticate::v2020_12_25', {
			payload: {
				skillId,
				apiKey,
				token,
			},
		})

		//@ts-ignore
		const { auth } = eventResponseUtil.getFirstResponseOrThrow(results)

		this.auth = auth

		return {
			skill: auth.skill,
			person: auth.person,
		}
	}

	public isConnected() {
		return !this.isReAuthing && this.isSocketConnected()
	}

	private isSocketConnected() {
		return this.socket?.connected ?? false
	}
}
