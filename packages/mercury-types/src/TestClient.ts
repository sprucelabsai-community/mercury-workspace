import { SchemaValues, ISchema } from '@sprucelabs/schema'
import MercuryEventEmitter, {
	MercuryAggregateResponse,
	EmitCallback,
	EventContract,
	EventSignature,
	ContractMapper,
	KeyOf,
	DeepReadonly,
} from './mercury.types'

export default class TestClient<Contract extends EventContract>
	implements MercuryEventEmitter<Contract> {
	public async emit<
		MappedContract extends ContractMapper<Contract> = ContractMapper<Contract>,
		EventName extends KeyOf<MappedContract> = KeyOf<MappedContract>,
		IEventSignature extends EventSignature = MappedContract[EventName],
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
		_payload:
			| (EmitSchema extends ISchema ? SchemaValues<EmitSchema> : never)
			| EmitCallback<MappedContract, EventName>
			| undefined,
		_cb?: EmitCallback<MappedContract, EventName> | undefined
	): Promise<MercuryAggregateResponse<ResponsePayload>> {
		//@ts-ignore
		const results = {
			totalContracts: 1,
			totalResponses: 1,
			responses: [
				{
					responderRef: 'test',
					payload: {
						responsePayloadField: 'hello',
					},
				},
			],
		} as MercuryAggregateResponse<ResponsePayload>

		return results
	}

	public async on<
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
	): Promise<void> {}

	public async off(
		_eventName: Extract<
			Contract['eventSignatures'][number]['eventNameWithOptionalNamespace'],
			string
		>
	): Promise<number> {
		return 0
	}
}
