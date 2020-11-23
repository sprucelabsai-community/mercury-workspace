import AbstractSpruceError from '@sprucelabs/error'
import {
	EmitCallback,
	EventContract,
	EventNames,
	EventSignature,
	MercuryAggregateResponse,
	eventContractUtil,
} from '@sprucelabs/mercury-types'
import { validateSchemaValues } from '@sprucelabs/schema'
import { ISchema, SchemaValues } from '@sprucelabs/schema'
import io from 'socket.io-client'
import { MercuryClient } from './client.types'
import SpruceError from './errors/SpruceError'
import socketIoEventUtil from './utilities/socketIoEventUtil.utility'

/*global SocketIOClient*/

type IoOptions = SocketIOClient.ConnectOpts

export default class MercurySocketIoClient<Contract extends EventContract>
	implements MercuryClient<Contract> {
	private host: string
	private ioOptions: IoOptions
	private socket?: SocketIOClient.Socket

	protected eventContract: Contract

	public constructor(
		options: { host: string; eventContract: Contract } & IoOptions
	) {
		const { host, eventContract, ...ioOptions } = options
		this.host = host
		this.ioOptions = ioOptions
		this.eventContract = eventContract
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
		EmitSchema extends ISchema = IEventSignature['emitPayloadSchema'] extends ISchema
			? IEventSignature['emitPayloadSchema']
			: never,
		ResponseSchema extends ISchema = IEventSignature['responsePayloadSchema'] extends ISchema
			? IEventSignature['responsePayloadSchema']
			: never,
		ResponsePayload = ResponseSchema extends ISchema
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
		const signature = eventContractUtil.getSignatureByName(
			this.eventContract,
			eventName
		)

		if (signature.emitPayloadSchema) {
			try {
				validateSchemaValues(
					signature.emitPayloadSchema as ISchema,
					payload ?? {}
				)
			} catch (err) {
				throw new SpruceError({ code: 'INVALID_PAYLOAD', originalError: err })
			}
		} else if (payload) {
			throw new SpruceError({ code: 'UNEXPECTED_PAYLOAD' })
		}

		const results: MercuryAggregateResponse<ResponsePayload> = await new Promise(
			(resolve) => {
				const ioName = socketIoEventUtil.toSocketName(eventName)
				const singleResponseName = eventName + ':response'

				if (cb) {
					this.socket?.on(singleResponseName, (response: any) => {
						void cb(response)
					})
				}

				const args: any[] = []

				if (payload) {
					args.push(payload)
				}

				args.push((results: any) => {
					this.socket?.off(singleResponseName)
					resolve(results)
				})

				this.socket?.emit(ioName, ...args)
			}
		)

		return results
	}

	public async on<
		EventName extends EventNames<Contract>,
		IEventSignature extends EventSignature = Contract['eventSignatures'][EventName],
		EmitSchema extends ISchema = IEventSignature['emitPayloadSchema'] extends ISchema
			? IEventSignature['emitPayloadSchema']
			: never
	>(
		eventName: EventName,
		cb: (
			payload: EmitSchema extends ISchema ? SchemaValues<EmitSchema> : never
		) => IEventSignature['responsePayloadSchema'] extends ISchema
			?
					| Promise<SchemaValues<IEventSignature['responsePayloadSchema']>>
					| SchemaValues<IEventSignature['responsePayloadSchema']>
			: Promise<void> | void
	) {
		//@ts-ignore
		const results = await this.emit('register-listeners', {
			payload: { eventNamesWithOptionalNamespace: [eventName] },
		})

		if (results.totalErrors > 0) {
			const options = results.responses[0].errors?.[0] ?? 'UNKNOWN_ERROR'
			throw AbstractSpruceError.parse(options, SpruceError)
		}

		this.socket?.on(
			eventName,
			async (targetAndPayload: any, ioCallback: (p: any) => void) => {
				if (cb) {
					const results = await cb(targetAndPayload)
					if (ioCallback) {
						ioCallback(results)
					}
				}
			}
		)
	}

	public async off(eventName: EventNames<Contract>): Promise<number> {
		return new Promise((resolve, reject) => {
			this.socket?.emit(
				'un-register-listeners',
				{
					payload: {
						eventNamesWithOptionalNamespace: [eventName],
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
						resolve(results.responses[0].payload.unRegisterCount)
					}
				}
			)
		})
	}

	public async disconnect() {
		if (this.socket) {
			await new Promise((resolve) => {
				this.socket?.on('disconnect', () => {
					this.socket?.removeAllListeners()
					this.socket = undefined
					resolve(undefined)
				})

				this.socket?.disconnect()
			})
		}
		return
	}

	public isConnected() {
		return this.socket?.connected ?? false
	}
}
