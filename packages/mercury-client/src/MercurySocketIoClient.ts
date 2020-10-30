import {
	ContractMapper,
	DeepReadonly,
	EmitCallback,
	EventContract,
	EventSignature,
	KeyOf,
	MercuryAggregateResponse,
} from '@sprucelabs/mercury-types'
import { ISchema, SchemaValues } from '@sprucelabs/schema'
import io from 'socket.io-client'
import { MercuryClient } from './client.types'

export default class MercurySocketIoClient<Contract extends EventContract>
	implements MercuryClient<Contract> {
	private host: string
	/*global SocketIOClient*/
	private socket?: SocketIOClient.Socket

	public constructor(options: { host: string }) {
		this.host = options.host
	}

	public async connect() {
		this.socket = io(this.host)

		await new Promise((resolve, reject) => {
			this.socket?.on('connection', () => {
				resolve()
				this.socket?.off('connection')
				this.socket?.off('connect_error')
			})

			this.socket?.on('connect_error', (err) => {
				debugger
				this.socket?.off('connect_error')
				this.socket?.off('err')
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
		_eventName: EventName,
		_payload?:
			| (EmitSchema extends SchemaValues<EmitSchema>
					? SchemaValues<EmitSchema>
					: never)
			| EmitCallback<MappedContract, EventName>,
		_cb?: EmitCallback<MappedContract, EventName>
	): Promise<MercuryAggregateResponse<ResponsePayload>> {
		let totalErrors = 0
		const listeners: any[] = []
		const responses: any[] = []

		return {
			totalContracts: listeners.length,
			totalResponses: listeners.length,
			totalErrors,
			responses,
		} as MercuryAggregateResponse<ResponsePayload>
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
		return
	}
}
