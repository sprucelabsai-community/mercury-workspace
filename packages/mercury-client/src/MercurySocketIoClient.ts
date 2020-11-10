import {
	ContractMapper,
	DeepReadonly,
	EmitCallback,
	EventContract,
	EventSignature,
	KeyOf,
	MercuryAggregateResponse,
} from '@sprucelabs/mercury-types'
import { validateSchemaValues } from '@sprucelabs/schema'
import { ISchema, SchemaValues } from '@sprucelabs/schema'
import io from 'socket.io-client'
import { MercuryClient } from './client.types'
import SpruceError from './errors/SpruceError'

/*global SocketIOClient*/

type IoOptions = SocketIOClient.ConnectOpts

export default class MercurySocketIoClient<Contract extends EventContract>
	implements MercuryClient<Contract> {
	private host: string
	private ioOptions: IoOptions
	private eventContract: Contract

	private socket?: SocketIOClient.Socket

	public constructor(
		options: { host: string; eventContract: Contract } & IoOptions
	) {
		const { host, eventContract, ...ioOptions } = options
		this.host = options.host
		this.ioOptions = ioOptions
		this.eventContract = eventContract
	}

	public async connect() {
		this.socket = io(this.host, this.ioOptions)

		await new Promise((resolve, reject) => {
			this.socket?.on('connect', () => {
				this.socket?.removeAllListeners()
				resolve()
			})

			this.socket?.on('timeout', (err: string) => {
				reject(err)
			})

			this.socket?.on('connect_error', (err: string) => {
				this.socket?.removeAllListeners()
				reject(err)
			})
		})
	}

	public async emit<
		MappedContract extends ContractMapper<Contract> = ContractMapper<Contract>,
		EventName extends KeyOf<MappedContract> = KeyOf<MappedContract>,
		IEventSignature extends DeepReadonly<EventSignature> = DeepReadonly<
			MappedContract[EventName]
		>,
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
			| EmitCallback<MappedContract, EventName>,
		_cb?: EmitCallback<MappedContract, EventName>
	): Promise<MercuryAggregateResponse<ResponsePayload>> {
		let totalErrors = 0
		const listeners: any[] = []
		const responses: any[] = []

		const signature = this.getEventSignatureByName<MappedContract>(eventName)

		if (signature.emitPayloadSchema) {
			try {
				validateSchemaValues(signature.emitPayloadSchema as ISchema, payload ?? {})
			} catch (err) {
				throw new SpruceError({ code: 'INVALID_PAYLOAD', originalError: err })
			}
		} else if (payload) {
			throw new SpruceError({ code: 'UNEXPECTED_PAYLOAD' })
		}

		await new Promise((resolve) => {
			const args: any[] = []

			if (payload) {
				args.push(payload)
			}

			args.push((results: any) => {
				debugger
				console.log(results)
			})

			this.socket?.emit(eventName, ...args)
		})


		return {
			totalContracts: listeners.length,
			totalResponses: listeners.length,
			totalErrors,
			responses,
		} as MercuryAggregateResponse<ResponsePayload>
	}

	private getEventSignatureByName<
		MappedContract extends ContractMapper<Contract> = ContractMapper<Contract>,
		EventName extends KeyOf<MappedContract> = KeyOf<MappedContract>
	>(eventName: EventName) {
		const sig = this.eventContract.eventSignatures.find(
			(sig) => sig.eventNameWithOptionalNamespace === eventName
		)

		if (!sig) {
			throw new SpruceError({
				code: 'INVALID_EVENT_NAME',
				eventNameWithOptionalNamespace: eventName,
			})
		}
		return sig
	}

	public on<
		MappedContract extends ContractMapper<Contract> = ContractMapper<Contract>,
		EventName extends KeyOf<MappedContract> = KeyOf<MappedContract>,
		IEventSignature extends DeepReadonly<
			EventSignature
		> = MappedContract[EventName],
		EmitSchema extends ISchema = IEventSignature['emitPayloadSchema'] extends ISchema
			? IEventSignature['emitPayloadSchema']
			: never
	>(
		_eventName: EventName,
		_cb: (
			payload: EmitSchema extends ISchema ? SchemaValues<EmitSchema> : never
		) => IEventSignature['responsePayloadSchema'] extends ISchema
			?
					| Promise<SchemaValues<IEventSignature['responsePayloadSchema']>>
					| SchemaValues<IEventSignature['responsePayloadSchema']>
			: Promise<void> | void
	) {}

	public off(
		_eventName: Extract<
			Contract['eventSignatures'][number]['eventNameWithOptionalNamespace'],
			string
		>,
		_cb?: () => void
	): number {
		return 1
	}

	public async disconnect() {
		this.socket?.disconnect()
		return
	}

	public isConnected() {
		return this.socket?.connected ?? false
	}
}
