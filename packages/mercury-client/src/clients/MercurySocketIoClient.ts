/*global SocketIOClient*/
import AbstractSpruceError from '@sprucelabs/error'
import {
	EmitCallback,
	EventContract,
	EventNames,
	EventSignature,
	MercuryAggregateResponse,
	MercurySingleResponse,
} from '@sprucelabs/mercury-types'
import { Schema, SchemaValues, validateSchemaValues } from '@sprucelabs/schema'
import {
	eventContractUtil,
	eventResponseUtil,
	eventNameUtil,
} from '@sprucelabs/spruce-event-utils'
import io from 'socket.io-client'
import { MercuryClient } from '../client.types'
import SpruceError from '../errors/SpruceError'
import socketIoEventUtil from '../utilities/socketIoEventUtil.utility'

type IoOptions = SocketIOClient.ConnectOpts

export default class MercurySocketIoClient<Contract extends EventContract>
	implements MercuryClient<Contract> {
	protected eventContract?: Contract

	private host: string
	private ioOptions: IoOptions
	private socket?: SocketIOClient.Socket
	private emitTimeoutMs: number

	public constructor(
		options: {
			host: string
			eventContract?: Contract
			emitTimeoutMs?: number
		} & IoOptions
	) {
		const { host, eventContract, emitTimeoutMs, ...ioOptions } = options

		this.host = host
		this.ioOptions = ioOptions
		this.eventContract = eventContract
		this.emitTimeoutMs = emitTimeoutMs ?? 10000
	}

	public async connect() {
		this.socket = io(this.host, this.ioOptions)

		await new Promise((resolve, reject) => {
			this.socket?.on('connect', () => {
				this.socket?.removeAllListeners()

				resolve(undefined)
			})

			this.socket?.on('timeout', (err: string) => {
				reject(err)
			})

			this.socket?.on('connect_error', (err: Record<string, any>) => {
				const error = this.mapSocketErrorToSpruceError(err)
				this.socket?.removeAllListeners()
				reject(error)
			})
		})
	}

	public mapSocketErrorToSpruceError(err: Record<string, any>) {
		const originalError = new Error(err.message)
		//@ts-ignore
		originalError.socketError = err

		switch (err.message) {
			case 'xhr poll error':
				return new SpruceError({
					code: 'CONNECTION_FAILED',
					host: this.host,
					statusCode: err.description,
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
		const signature = this.getEventSignatureByName(eventName)

		if (!this.isConnected()) {
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

		const results: MercuryAggregateResponse<ResponsePayload> = await new Promise(
			(resolve, reject) => {
				try {
					const emitTimeout = setTimeout(() => {
						this.socket?.off(responseEventName)
						reject(
							new SpruceError({
								code: 'TIMEOUT',
								eventName,
								timeoutMs: this.emitTimeoutMs,
								isConnected: this.isConnected(),
							})
						)
					}, this.emitTimeoutMs)

					args.push((results: any) => {
						clearTimeout(emitTimeout)

						this.socket?.off(responseEventName, singleResponseHandler)

						resolve(results)
					})

					const ioName = socketIoEventUtil.toSocketName(eventName)
					this.socket?.emit(ioName, ...args)
				} catch (err) {
					reject(err)
				}
			}
		)

		return eventResponseUtil.mutatingMapAggregateResponseErrorsToSpruceErrors(
			results,
			SpruceError
		)
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
		//@ts-ignore
		const results = await this.emit('register-listeners::v2020_12_25', {
			payload: { fullyQualifiedEventNames: [eventName] },
		})

		if (results.totalErrors > 0) {
			const options = results.responses[0].errors?.[0] ?? 'UNKNOWN_ERROR'
			throw AbstractSpruceError.parse(options, SpruceError)
		}
		this.socket?.on(
			eventName,
			async (targetAndPayload: any, ioCallback: (p: any) => void) => {
				if (cb) {
					try {
						const results = await cb(targetAndPayload)
						if (ioCallback) {
							ioCallback(results)
						}
					} catch (err) {
						ioCallback && ioCallback({ errors: [err] })
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
		if (this.socket) {
			await new Promise((resolve) => {
				this.socket?.once('disconnect', () => {
					this.socket?.removeAllListeners()
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

		return {
			skill: auth.skill,
			person: auth.person,
		}
	}

	public isConnected() {
		return this.socket?.connected ?? false
	}
}
