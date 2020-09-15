import { ISchema, SchemaValues } from '@sprucelabs/schema'
import { SpruceSchemas } from '#spruce/schemas/schemas.types'

export type EventContract = SpruceSchemas.MercuryTypes.v2020_09_01.IEventSignature
export type Permission = SpruceSchemas.MercuryTypes.v2020_09_01.IPermission
export type AuthorizerStatus = Omit<keyof Permission, 'name'>
export type PermissionContract = SpruceSchemas.MercuryTypes.v2020_09_01.IPermissionContract

export type MercuryAggregateResponse<Payload> = {
	totalContracts: number
	totalResponses: number
	responses: {
		responderName: string
		errors?: Error[]
		payload: Payload
	}[]
}

export interface MercurySingleResponse<Payload> {
	totalContracts: number
	responseIdx: number
	responderName: string
	errors?: Error[]
	payload?: Payload
}

export type EventSignature = SpruceSchemas.MercuryTypes.v2020_09_01.IEventSignature
export type MercuryContract = SpruceSchemas.MercuryTypes.v2020_09_01.IMercuryContract

export type KeyOf<O> = Extract<keyof O, string>

export type ContractMapper<Contract extends MercuryContract> = {
	[K in Contract['eventSignatures'][number]['eventNameWithOptionalNamespace']]: Contract['eventSignatures'][number] & {
		eventNameWithOptionalNamespace: K
	}
}

export type EmitCallback<
	MappedContract extends ContractMapper<MercuryContract> = ContractMapper<
		MercuryContract
	>,
	EventName extends KeyOf<MappedContract> = KeyOf<MappedContract>,
	IEventSignature extends EventSignature = MappedContract[EventName],
	ResponseSchema extends ISchema = IEventSignature['responsePayload'] extends ISchema
		? IEventSignature['responsePayload']
		: never,
	ResponsePayload = ResponseSchema extends ISchema
		? SchemaValues<ResponseSchema>
		: never
> = (payload: MercurySingleResponse<ResponsePayload>) => void | Promise<void>

export default interface MercuryClient<Contract extends MercuryContract> {
	emit<
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
		eventName: EventName,
		payload: EmitPayload extends SchemaValues<EmitSchema>
			? SchemaValues<EmitSchema>
			: never,
		cb?: EmitCallback<MappedContract, EventName>
	): Promise<MercuryAggregateResponse<ResponsePayload>>

	emit<
		MappedContract extends ContractMapper<Contract> = ContractMapper<Contract>,
		EventName extends KeyOf<MappedContract> = KeyOf<MappedContract>,
		IEventSignature extends EventSignature = MappedContract[EventName],
		ResponseSchema extends
			| ISchema
			| never = IEventSignature['responsePayload'] extends ISchema
			? IEventSignature['responsePayload']
			: never,
		ResponsePayload = ResponseSchema extends ISchema
			? SchemaValues<ResponseSchema>
			: never
	>(
		eventName: EventName,
		cb?: EmitCallback<MappedContract, EventName>
	): Promise<MercuryAggregateResponse<ResponsePayload>>
}
