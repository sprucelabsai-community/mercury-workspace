import { ISchema, SchemaValues } from '@sprucelabs/schema'

export interface MercuryPagedResponse {
	payload: ISchema
}

export interface MercuryAggregateResults {
	responses: {}
}

export interface MercuryContract {
	[eventNamespace: string]: {
		[eventName: string]: {
			listenResponsePayload: ISchema | MercuryPagedResponse
			emitPayload: ISchema
		}
	}
}

export type ExtractListenerPayload<
	Payload extends ISchema | MercuryPagedResponse
> = Payload extends ISchema ? ISchema : MercuryPagedResponse['payload']

export default interface MercuryClient<C extends MercuryContract> {
	on<
		EventNamespace extends string,
		EventName extends string,
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
		cb?: (
			payload: EmitPayload
		) => ListenResponsePayload | Promise<ListenResponsePayload>
	): Promise<void>

	emit<
		EventNamespace extends string,
		EventName extends string,
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
		payload: EmitPayload,
		cb?: (payload: ListenResponsePayload) => void | Promise<void>
	): Promise<void>
}

export interface MercuryConstructor<C extends MercuryContract> {
	(): MercuryClient<C>
}
