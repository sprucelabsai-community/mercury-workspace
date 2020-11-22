import { SchemaValues, ISchema } from '@sprucelabs/schema'
import MercuryEventEmitter, {
	MercuryAggregateResponse,
	EmitCallback,
	EventContract,
	EventSignature,
	KeyOf,
	EventNames,
} from './mercury.types'

export default class TestClient<Contract extends EventContract>
	implements MercuryEventEmitter<Contract> {
	public async emit<
		EventName extends EventNames<Contract> = EventNames<Contract>,
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
		_eventName: EventName,
		_payload:
			| (EmitSchema extends ISchema ? SchemaValues<EmitSchema> : never)
			| EmitCallback<Contract, EventName>
			| undefined,
		_cb?: EmitCallback<Contract, EventName> | undefined
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
		EventName extends KeyOf<Contract['eventSignatures']> = KeyOf<
			Contract['eventSignatures']
		>,
		IEventSignature extends EventSignature = Contract['eventSignatures'][EventName],
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

	public async off(_eventName: EventNames<Contract>): Promise<number> {
		return 0
	}
}
