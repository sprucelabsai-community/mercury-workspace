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
import {
	Schema,
	SchemaError,
	SchemaValues,
	validateSchemaValues,
} from '@sprucelabs/schema'
import {
	eventContractUtil,
	eventResponseUtil,
	eventNameUtil,
} from '@sprucelabs/spruce-event-utils'
import { io, Socket, SocketOptions, ManagerOptions } from 'socket.io-client'
import SpruceError from '../errors/SpruceError'
import { ConnectionOptions, MercuryClient } from '../types/client.types'
import socketIoEventUtil from '../utilities/socketIoEventUtil.utility'

export default class MercurySocketIoClient<Contract extends EventContract>
	implements MercuryClient<Contract>
{
	protected eventContract?: Contract

	public static io = io
	private host: string
	private ioOptions: IoOptions
	private socket?: Socket
	private proxyToken: string | null = null
	private emitTimeoutMs: number
	private reconnectDelayMs: number
	private isReAuthing = false
	private reconnectPromise: any = null
	protected lastAuthOptions?: {
		skillId?: string | undefined
		apiKey?: string | undefined
		token?: string | undefined
	}
	private shouldReconnect: boolean
	private connectionRetries = 5
	private registeredListeners: any[] = []
	private allowNextEventToBeAuthenticate = false
	protected auth?: {
		skill?: SpruceSchemas.Spruce.v2020_07_22.Skill
		person?: SpruceSchemas.Spruce.v2020_07_22.Person
	}
	private shouldAutoRegisterListeners = true
	private isManuallyDisconnected = false
	private isReconnecting = false
	private id: string
	private skipWaitIfReconnecting = false
	private maxEmitRetries: number
	private authRawResults?: MercuryAggregateResponse<any>
	protected authPromise?: any
	private shouldRegisterProxyOnReconnect = false

	public constructor(
		options: {
			host: string
			eventContract?: Contract
		} & IoOptions
	) {
		const {
			host,
			eventContract,
			emitTimeoutMs,
			reconnectDelayMs,
			shouldReconnect,
			maxEmitRetries = 5,
			connectionRetries,
			...ioOptions
		} = options

		this.host = host
		this.ioOptions = { ...ioOptions, withCredentials: false }
		this.eventContract = eventContract
		this.emitTimeoutMs = emitTimeoutMs ?? 30000
		this.reconnectDelayMs = reconnectDelayMs ?? 5000
		this.shouldReconnect = shouldReconnect ?? true
		this.id = new Date().getTime().toString()
		this.maxEmitRetries = maxEmitRetries
		this.connectionRetries = connectionRetries ?? 5
	}

	public async connect() {
		this.socket = MercurySocketIoClient.io(this.host, this.ioOptions)

		await new Promise((resolve, reject) => {
			this.socket?.on('connect', () => {
				//@ts-ignore
				this.socket?.removeAllListeners()

				if (this.shouldReconnect) {
					this.socket?.once('disconnect', async (opts) => {
						this.log('Mercury disconnected, reason:', opts)
						await this.attemptReconnectAfterDelay()
					})
				}

				this.attachConnectError()
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

			this.attachConnectError(reject, resolve as Resolve)
		})
	}

	private attachConnectError(
		reject?: (reason?: any) => void,
		resolve?: Resolve
	) {
		this.socket?.on('connect_error', async (err: Record<string, any>) => {
			const error = this.mapSocketErrorToSpruceError(err)
			//@ts-ignore
			this.socket?.removeAllListeners()

			this.connectionRetries--

			this.log('Failed to connect to Mercury', error.message)
			this.log('Connection retries left', `${this.connectionRetries}`)

			if (this.connectionRetries === 0) {
				reject?.(error)
				return
			}

			try {
				this.isReconnecting = false
				await this.attemptReconnectAfterDelay()
				resolve?.()
			} catch (err) {
				//@ts-ignore
				reject?.(err)
			}
		})
	}

	private async attemptReconnectAfterDelay(retriesLeft = this.maxEmitRetries) {
		if (this.isManuallyDisconnected) {
			this.isReconnecting = false
			return
		}

		if (this.isReconnecting) {
			return
		}

		this.log('Attempting to reconnect...')

		delete this.authPromise

		this.isReconnecting = true
		this.proxyToken = null

		this.reconnectPromise = new Promise((resolve: any, reject: any) => {
			if (this.lastAuthOptions) {
				this.isReAuthing = true
			}

			setTimeout(async () => {
				try {
					this.connectionRetries = 1

					await this.connect()

					if (this.isManuallyDisconnected) {
						this.isReconnecting = false
						return
					}

					this.skipWaitIfReconnecting = true

					if (this.lastAuthOptions) {
						await this.authenticate(this.lastAuthOptions)
					}

					if (this.isManuallyDisconnected) {
						this.isReconnecting = false
						return
					}

					if (this.shouldRegisterProxyOnReconnect) {
						await this.registerProxyToken()
					}

					if (this.isManuallyDisconnected) {
						this.isReconnecting = false
						return
					}

					await this.reRegisterAllListeners()

					this.isReAuthing = false
					this.isReconnecting = false
					this.skipWaitIfReconnecting = false
					resolve()
					this.log(`Connection re-established with Mercury!`)
				} catch (err: any) {
					;(console.error ?? console.log)(err.message)

					this.isReconnecting = false
					this.skipWaitIfReconnecting = false

					retriesLeft = retriesLeft - 1

					if (
						(err.options.code === 'TIMEOUT' ||
							err.options.code === 'CONNECTION_FAILED') &&
						retriesLeft > 0
					) {
						await this.attemptReconnectAfterDelay(retriesLeft)
							.then(resolve)
							.catch(reject)
					} else {
						this.lastAuthOptions = undefined
						reject(err)
					}
				}
			}, this.reconnectDelayMs)
		})

		return this.reconnectPromise
	}

	private log(...args: any[]) {
		return (console.error ?? console.log)(...args)
	}

	protected async waitIfReconnecting() {
		await this.reconnectPromise
	}

	private async reRegisterAllListeners() {
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
			| (EmitSchema extends Schema ? SchemaValues<EmitSchema> : never)
			| EmitCallback<Contract, EventName>,
		cb?: EmitCallback<Contract, EventName>
	): Promise<MercuryAggregateResponse<ResponsePayload>> {
		return this._emit(this.maxEmitRetries, eventName, payload, cb)
	}

	public async emitAndFlattenResponses<
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
			| (EmitSchema extends Schema ? SchemaValues<EmitSchema> : never)
			| EmitCallback<Contract, EventName>,
		cb?: EmitCallback<Contract, EventName>
	): Promise<ResponsePayload[]> {
		const results = await this.emit(eventName, payload, cb)

		const { payloads, errors } =
			eventResponseUtil.getAllResponsePayloadsAndErrors(results, SpruceError)

		if (errors?.[0]) {
			throw errors[0]
		}

		return payloads as any
	}

	private async _emit<
		EventName extends EventNames<Contract>,
		IEventSignature extends EventSignature = Contract['eventSignatures'][EventName],
		ResponseSchema extends Schema = IEventSignature['responsePayloadSchema'] extends Schema
			? IEventSignature['responsePayloadSchema']
			: never,
		ResponsePayload = ResponseSchema extends Schema
			? SchemaValues<ResponseSchema>
			: never
	>(
		retriesRemaining: number,
		eventName: EventName,
		payload?: any,
		cb?: EmitCallback<Contract, EventName>
	) {
		if (!this.skipWaitIfReconnecting) {
			await this.waitIfReconnecting()
		}

		if (
			!this.allowNextEventToBeAuthenticate &&
			eventName === authenticateFqen
		) {
			throw new SchemaError({
				code: 'INVALID_PARAMETERS',
				parameters: ['eventName'],
				friendlyMessage: `You can't emit '${authenticateFqen}' event directly. Use client.authenticate() so all your auth is preserved.`,
			})
		} else if (eventName === authenticateFqen) {
			this.allowNextEventToBeAuthenticate = false
		}

		if (this.isManuallyDisconnected) {
			throw new SpruceError({
				code: 'NOT_CONNECTED',
				action: 'emit',
				fqen: eventName,
			})
		}

		this.assertValidEmitTargetAndPayload(eventName, payload)

		const responseEventName = eventNameUtil.generateResponseEventName(eventName)
		const singleResponsePromises: Promise<void>[] = []

		const singleResponseHandler = async (
			response: MercurySingleResponse<ResponsePayload>
		) => {
			if (cb) {
				let resolve: () => void | undefined
				singleResponsePromises.push(
					new Promise((r) => {
						resolve = r
					})
				)

				await cb(
					eventResponseUtil.mutatingMapSingleResonseErrorsToSpruceErrors(
						response,
						SpruceError
					) as any
				)

				//@ts-ignore
				resolve()
			}
		}

		if (cb) {
			this.socket?.on(responseEventName, singleResponseHandler)
		}

		const args: any[] = []

		if (payload || this.proxyToken) {
			const p: Record<string, any> = {
				...payload,
			}

			if (eventName !== authenticateFqen && this.proxyToken && !p.source) {
				p.source = {
					proxyToken: this.proxyToken,
				}
			}

			args.push(p)
		}

		const results: MercuryAggregateResponse<ResponsePayload> =
			await new Promise((resolve, reject) => {
				try {
					const emitTimeout = setTimeout(async () => {
						this.socket?.off(responseEventName, singleResponseHandler)

						if (retriesRemaining == 0) {
							const err = new SpruceError({
								code: 'TIMEOUT',
								eventName,
								timeoutMs: this.emitTimeoutMs,
								isConnected: this.isSocketConnected(),
								totalRetries: this.maxEmitRetries,
							})

							reject(err)
							return
						}

						retriesRemaining--

						try {
							if (eventName === authenticateFqen && this.authRawResults) {
								resolve(this.authRawResults)
								return
							}

							this.allowNextEventToBeAuthenticate = true

							//@ts-ignore
							const results = await this._emit(
								retriesRemaining,
								eventName,
								payload,
								cb
							)

							//@ts-ignore
							resolve(results)
						} catch (err) {
							reject(err)
						}
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

		await Promise.all(singleResponsePromises)

		return eventResponseUtil.mutatingMapAggregateResponseErrorsToSpruceErrors(
			results,
			SpruceError
		)
	}

	protected assertValidEmitTargetAndPayload<
		EventName extends EventNames<Contract>
	>(eventName: EventName, payload: any) {
		const signature = this.getEventSignatureByName(eventName)
		if (signature.emitPayloadSchema) {
			try {
				validateSchemaValues(
					signature.emitPayloadSchema as Schema,
					payload ?? {}
				)
			} catch (err: any) {
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
				payload: { events: [{ eventName }] },
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
					} catch (err: any) {
						let thisErr = err
						if (ioCallback) {
							if (!(err instanceof AbstractSpruceError)) {
								thisErr = new SpruceError({
									//@ts-ignore
									code: 'LISTENER_ERROR',
									fqen: eventName,
									friendlyMessage: err.message,
									originalError: err,
								})
							}
							ioCallback({ errors: [thisErr.toObject()] })
						}
					}
				}
			}
		)
	}

	public async off(eventName: EventNames<Contract>): Promise<number> {
		return new Promise((resolve, reject) => {
			if (!this.socket || !this.auth) {
				resolve(0)
			}
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

	public getId() {
		return this.id
	}

	public async disconnect() {
		this.isManuallyDisconnected = true
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

	public async authenticate(options: AuthenticateOptions) {
		const { skillId, apiKey, token } = options

		if (this.authPromise) {
			await this.authPromise
			return {
				skill: this.auth?.skill,
				person: this.auth?.person,
			}
		}

		this.lastAuthOptions = options
		this.allowNextEventToBeAuthenticate = true

		//@ts-ignore
		this.authPromise = this.emit('authenticate::v2020_12_25', {
			payload: {
				skillId,
				apiKey,
				token,
			},
		})

		const results = await this.authPromise

		//@ts-ignore
		const { auth } = eventResponseUtil.getFirstResponseOrThrow(results)

		this.authRawResults = results
		this.auth = auth

		return {
			skill: auth.skill,
			person: auth.person,
		}
	}

	public isAuthenticated(): boolean {
		return !!this.auth
	}

	public isConnected() {
		return !this.isReAuthing && this.isSocketConnected()
	}

	private isSocketConnected() {
		return this.socket?.connected ?? false
	}

	public getProxyToken() {
		return this.proxyToken
	}

	public setProxyToken(token: string) {
		this.proxyToken = token
	}

	public async registerProxyToken() {
		const results = await this.emit('register-proxy-token::v2020_12_25' as any)

		//@ts-ignore
		const { token } = eventResponseUtil.getFirstResponseOrThrow(results)

		this.setProxyToken(token)

		this.shouldRegisterProxyOnReconnect = true

		return token
	}

	public getIsTestClient() {
		return false
	}
}

type IoOptions = Partial<ManagerOptions & SocketOptions & ConnectionOptions>

export const authenticateFqen = 'authenticate::v2020_12_25'
export interface AuthenticateOptions {
	skillId?: string
	apiKey?: string
	token?: string
}

type Resolve = () => void
