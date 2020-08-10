import { SchemaValues, ISchema } from '@sprucelabs/schema'
import MercuryClient, {
	KeyOf,
	MercuryAggregateResponse,
	EventSignature,
	EmitCallback,
} from 'Mercury.types'

export default class TestClient<Contract extends Record<string, any>>
	implements MercuryClient<Contract> {
	public async emit<
		EventName extends KeyOf<Contract>,
		Payload extends Contract[EventName] extends EventSignature
			? Contract[EventName]['emitPayload'] extends ISchema
				? SchemaValues<Contract[EventName]['emitPayload']>
				: never
			: never,
		ResponsePayload extends Contract[EventName] extends EventSignature
			? Contract[EventName]['responsePayload'] extends ISchema
				? SchemaValues<Contract[EventName]['responsePayload']>
				: never
			: never
	>(
		_eventName: EventName,
		_payload?: Payload | EmitCallback<Contract, EventName>,
		_cb?: EmitCallback<Contract, EventName> | undefined
	): Promise<MercuryAggregateResponse<ResponsePayload>> {
		const results: MercuryAggregateResponse<ResponsePayload> = {
			responses: [
				{
					responderName: 'test',
					// @ts-ignore
					payload: {
						responsePayloadField: 'hello',
					},
				},
			],
		}

		return results
	}
}
