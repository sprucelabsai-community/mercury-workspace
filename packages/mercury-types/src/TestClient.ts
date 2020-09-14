import { SchemaValues, ISchema } from '@sprucelabs/schema'
import MercuryClient, {
	MercuryAggregateResponse,
	EmitCallback,
	MercuryContract,
	EventSignature,
	ContractMapper,
	KeyOf,
} from './mercury.types'

export default class TestClient<Contract extends MercuryContract>
	implements MercuryClient<Contract> {
	public async emit<
		MappedContract extends ContractMapper<Contract> = ContractMapper<Contract>,
		EventName extends KeyOf<MappedContract> = KeyOf<MappedContract>,
		IEventSignature extends EventSignature = MappedContract[EventName],
		EmitSchema extends
			| ISchema
			| never = IEventSignature['emitPayload'] extends ISchema
			? IEventSignature['emitPayload']
			: never,
		EmitPayload = EmitSchema extends ISchema ? SchemaValues<EmitSchema> : never,
		ResponseSchema extends
			| ISchema
			| never = IEventSignature['responsePayload'] extends ISchema
			? IEventSignature['responsePayload']
			: never,
		ResponsePayload = ResponseSchema extends ISchema
			? SchemaValues<ResponseSchema>
			: never
	>(
		_eventName: EventName,
		_payload:
			| (EmitPayload extends SchemaValues<EmitSchema>
					? SchemaValues<EmitSchema>
					: never)
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
					responderName: 'test',
					payload: {
						responsePayloadField: 'hello',
					},
				},
			],
		} as MercuryAggregateResponse<ResponsePayload>

		return results
	}
}
