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

/*global SocketIOClient*/

type IoOptions = SocketIOClient.ConnectOpts

export default class MercurySocketIoClient<Contract extends EventContract>
	implements MercuryClient<Contract> {
	private host: string
		private ioOptions: IoOptions

	
	private socket?: SocketIOClient.Socket

	public constructor(options: { host: string } & IoOptions) {
		const {host, ...ioOptions} = options
		this.host = options.host
		this.ioOptions = ioOptions

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
		this.socket?.disconnect()
		return
	}

	public isConnected() {
		return this.socket?.connected ?? false
	}
}
