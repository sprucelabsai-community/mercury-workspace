import { ISchema, SchemaValues } from '@sprucelabs/schema'

export interface MercuryResponse {
	payload: ISchema
}

export interface MercuryContract {
	[eventNamespace: string]: {
		[eventName: string]: {
			listenResponsePayload: ISchema | MercuryResponse
			emitPayload: ISchema
		}
	}
}

export type ExtractListenerPayload<
	Payload extends ISchema | MercuryResponse
> = Payload extends ISchema ? ISchema : MercuryResponse['payload']

export default interface MercuryClient<C extends MercuryContract> {
	on<
		EventNamespace extends string,
		EventName extends string,
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
			payload: ListenPayload
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
