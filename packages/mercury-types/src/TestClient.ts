import { SchemaValues } from '@sprucelabs/schema'
import MercuryClient, {
	MercuryContract,
	ExtractListenerPayload,
	KeyOf,
	MercuryAggregateResults,
} from 'Mercury.types'

export class TestClient<C extends MercuryContract> implements MercuryClient<C> {
	private invocations: {
		eventNamespace: string
		eventName: string
		action: 'on' | 'emit'
		payload?: Record<string, any>
		cb?: (payload: any) => any
	}[] = []

	public async on<
		EventNamespace extends KeyOf<C>,
		EventName extends KeyOf<C[EventNamespace]>,
		ListenPayload extends SchemaValues<
			C[EventNamespace][EventName]['emitPayload']
		>,
		ListenResponsePayload extends SchemaValues<
			ExtractListenerPayload<
				C[EventNamespace][EventName]['listenResponsePayload']
			>
		>
	>(
		eventNamespace: EventNamespace,
		eventName: EventName,
		cb?: (
			payload?: ListenPayload
		) => ListenResponsePayload | Promise<ListenResponsePayload>
	): Promise<void> {
		this.invocations.push({ eventNamespace, eventName, action: 'on', cb })
	}

	public async emit<
		EventNamespace extends KeyOf<C>,
		EventName extends KeyOf<C[EventNamespace]>,
		EmitPayload extends SchemaValues<
			C[EventNamespace][EventName]['emitPayload']
		>,
		ListenResponsePayload extends SchemaValues<
			ExtractListenerPayload<
				C[EventNamespace][EventName]['listenResponsePayload']
			>
		>
	>(
		eventNamespace: EventNamespace,
		eventName: EventName,
		payload?: EmitPayload,
		cb?: (payload?: ListenResponsePayload) => void | Promise<void>
	): Promise<MercuryAggregateResults> {
		this.invocations.push({
			eventNamespace,
			eventName,
			action: 'emit',
			cb,
			payload,
		})

		return ({} as unknown) as MercuryAggregateResults
	}
}
