import { ISchema, SchemaValues } from '@sprucelabs/schema'

export interface MercuryPagedResponse {
	payload: ISchema
}

export interface MercuryAggregateResults {
	responses: {
		eventNamespace: string
		payload: ResponsePayload
	}[]
}

export type ResponsePayload = ISchema | MercuryPagedResponse

export interface MercuryContract {
	[eventNamespace: string]: {
		[eventName: string]: {
			listenResponsePayload: ResponsePayload | undefined
			emitPayload: ISchema | undefined
		}
	}
}

export type ExtractListenerPayload<
	Payload extends ISchema | MercuryPagedResponse
> = Payload extends ISchema ? ISchema : MercuryPagedResponse['payload']

export type KeyOf<O extends Record<string, any>> = Extract<keyof O, string>

export default interface MercuryClient<C extends MercuryContract> {
	on<
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
		cb?: (
			payload?: EmitPayload
		) => ListenResponsePayload | Promise<ListenResponsePayload>
	): Promise<void>

	emit<
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
	): Promise<MercuryAggregateResults>
}

export interface MercuryConstructor<C extends MercuryContract> {
	(): MercuryClient<C>
}
