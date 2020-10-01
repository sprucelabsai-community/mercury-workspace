import { SchemaValues, ISchema } from '@sprucelabs/schema'
import MercuryClient, {
	MercuryAggregateResponse,
	EmitCallback,
	MercuryContract,
	EventSignature,
	ContractMapper,
	KeyOf,
	DeepReadonly,
} from './mercury.types'

export default class TestClient<Contract extends MercuryContract>
	implements MercuryClient<Contract> {
	public async emit<
		MappedContract extends ContractMapper<Contract> = ContractMapper<Contract>,
		EventName extends KeyOf<MappedContract> = KeyOf<MappedContract>,
		IEventSignature extends EventSignature = MappedContract[EventName],
		EmitSchema extends ISchema = IEventSignature['emitPayload'] extends ISchema
			? IEventSignature['emitPayload']
			: never,
		ResponseSchema extends ISchema = IEventSignature['responsePayload'] extends ISchema
			? IEventSignature['responsePayload']
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

	public on<
		MappedContract extends ContractMapper<Contract> = ContractMapper<Contract>,
		EventName extends KeyOf<MappedContract> = KeyOf<MappedContract>,
		IEventSignature extends DeepReadonly<
			EventSignature
		> = MappedContract[EventName],
		EmitSchema extends ISchema = IEventSignature['emitPayload'] extends ISchema
			? IEventSignature['emitPayload']
			: never
	>(
		_eventName: EventName,
		_cb: (
			payload: EmitSchema extends ISchema ? SchemaValues<EmitSchema> : never
		) => IEventSignature['responsePayload'] extends ISchema
			?
					| Promise<SchemaValues<IEventSignature['responsePayload']>>
					| SchemaValues<IEventSignature['responsePayload']>
			: Promise<void> | void
	): void {}

	public off(
		_eventName: Extract<
			Contract['eventSignatures'][number]['eventNameWithOptionalNamespace'],
			string
		>
	): number {
		return 0
	}
}
