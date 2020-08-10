import { SchemaValues } from '@sprucelabs/schema'
import MercuryClient, {
	MercuryContract,
	ExtractListenerPayload,
} from 'Mercury.types'

interface TestContract extends MercuryContract {
	spruce: {
		test: {}
	}
}

export class TestClient implements MercuryClient<TestContract> {
	public async on<
		EventNamespace extends string,
		EventName extends string,
		ListenPayload extends SchemaValues<
			TestContract[EventNamespace][EventName]['emitPayload']
		>,
		ListenResponsePayload extends SchemaValues<
			ExtractListenerPayload<
				TestContract[EventNamespace][EventName]['listenResponsePayload']
			>
		>
	>(
		eventNamespace: EventNamespace,
		eventName: EventName,
		cb?: (
			payload: ListenPayload
		) => ListenResponsePayload | Promise<ListenResponsePayload>
	): Promise<void> {}

	public async emit<
		EventNamespace extends string,
		EventName extends string,
		EmitPayload extends SchemaValues<
			TestContract[EventNamespace][EventName]['emitPayload']
		>,
		ListenResponsePayload extends SchemaValues<
			ExtractListenerPayload<
				TestContract[EventNamespace][EventName]['listenResponsePayload']
			>
		>
	>(
		eventNamespace: EventNamespace,
		eventName: EventName,
		payload: EmitPayload,
		cb?: (payload: ListenResponsePayload) => void | Promise<void>
	): Promise<void> {}
}
