import { ISchema, SchemaValues } from '@sprucelabs/schema'

export const authorizerStatuses = [
	'clocked-in',
	'clocked-out',
	'on-prem',
	'off-prem',
	// eslint-disable-next-line no-undef
] as const

export type AuthorizerStatus = typeof authorizerStatuses[number]

export type PermissionAccess = {
	[K in typeof authorizerStatuses[number]]?: boolean
}

export type PermissionContract = {
	[name: string]: PermissionAccess
}

export interface MercuryAggregateResponse<Payload> {
	totalContracts: number
	totalResponses: number
	responses: {
		responderName: string
		errors?: Error[]
		payload?: Payload
	}[]
}

export interface MercurySingleResponse<Payload> {
	totalContracts: number
	responseIdx: number
	responderName: string
	errors?: Error[]
	payload?: Payload
}

export interface EventSignature {
	responsePayload?: ISchema
	emitPayload?: ISchema
	listenPermissionsAny?: PermissionContract
	emitPermissionsAny?: PermissionContract
}

export interface MercuryContract {
	[eventNameWithOptionalNamespace: string]: EventSignature
}

export type KeyOf<O> = Extract<keyof O, string>

export type EmitCallback<
	Contract extends Record<string, any>,
	EventName extends KeyOf<Contract>,
	ResponsePayload extends Contract[EventName] extends EventSignature
		? Contract[EventName]['responsePayload'] extends ISchema
			? SchemaValues<Contract[EventName]['responsePayload']>
			: never
		: never = Contract[EventName] extends EventSignature
		? Contract[EventName]['responsePayload'] extends ISchema
			? SchemaValues<Contract[EventName]['responsePayload']>
			: never
		: never
> = (payload: MercurySingleResponse<ResponsePayload>) => void | Promise<void>

export default interface MercuryClient<Contract extends Record<string, any>> {
	emit<
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
		eventName: EventName,
		payload: Payload,
		cb?: EmitCallback<Contract, EventName>
	): Promise<MercuryAggregateResponse<ResponsePayload>>

	emit<
		EventName extends KeyOf<Contract>,
		ResponsePayload extends Contract[EventName] extends EventSignature
			? Contract[EventName]['responsePayload'] extends ISchema
				? SchemaValues<Contract[EventName]['responsePayload']>
				: never
			: never
	>(
		eventName: EventName,
		cb?: EmitCallback<Contract, EventName>
	): Promise<MercuryAggregateResponse<ResponsePayload>>
}
