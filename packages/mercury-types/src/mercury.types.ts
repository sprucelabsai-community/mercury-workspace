import { ISchema, SchemaValues } from '@sprucelabs/schema'
import { SpruceSchemas } from '#spruce/schemas/schemas.types'
import { authorizerStatuses } from './constants'

export type EventContract = SpruceSchemas.MercuryTypes.v2020_09_01.IEventSignature
export type Permission = SpruceSchemas.MercuryTypes.v2020_09_01.IPermission
type Statuses = typeof authorizerStatuses
export type AuthorizerStatus = Statuses[number]['name']
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

type DeepReadonly<T> = T extends (infer R)[]
	? DeepReadonlyArray<R>
	: T extends []
	? T
	: T extends Record<string, any>
	? DeepReadonlyObject<T>
	: T

interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

type DeepReadonlyObject<T> = {
	readonly [P in keyof T]: DeepReadonly<T[P]>
}

export type EventSignature = DeepReadonly<
	SpruceSchemas.MercuryTypes.v2020_09_01.IEventSignature
>
export type MercuryContract = DeepReadonly<
	SpruceSchemas.MercuryTypes.v2020_09_01.IMercuryContract
>

export type KeyOf<O> = Extract<keyof O, string>

export type ContractMapper<Contract extends MercuryContract> = {
	[K in Contract['eventSignatures'][number]['eventNameWithOptionalNamespace']]: Contract['eventSignatures'][number] & {
		eventNameWithOptionalNamespace: K
	}
}

export type EventNames<
	Contract extends MercuryContract,
	MappedContract extends ContractMapper<Contract> = ContractMapper<Contract>,
	EventName extends KeyOf<MappedContract> = KeyOf<MappedContract>
> = EventName

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
		EmitSchema extends ISchema = IEventSignature['emitPayload'] extends ISchema
			? IEventSignature['emitPayload']
			: never,
		ResponseSchema extends ISchema = IEventSignature['responsePayload'] extends ISchema
			? IEventSignature['responsePayload']
			: never,
		ResponsePayload = ResponseSchema extends ISchema
			? SchemaValues<ResponseSchema>
			: never
	>(
		eventName: EventName,
		payload: EmitSchema extends SchemaValues<EmitSchema>
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

	on<
		MappedContract extends ContractMapper<Contract> = ContractMapper<Contract>,
		EventName extends KeyOf<MappedContract> = KeyOf<MappedContract>,
		IEventSignature extends EventSignature = MappedContract[EventName],
		EmitSchema extends ISchema = IEventSignature['emitPayload'] extends ISchema
			? IEventSignature['emitPayload']
			: never
	>(
		eventName: EventName,
		cb: (
			payload: EmitSchema extends ISchema ? SchemaValues<EmitSchema> : never
		) => IEventSignature['responsePayload'] extends ISchema
			?
					| Promise<SchemaValues<IEventSignature['responsePayload']>>
					| SchemaValues<IEventSignature['responsePayload']>
			: Promise<void> | void
	): void

	off(
		eventName: EventNames<Contract>,
		cb?: (payload?: Record<string, any>) => void
	): number
}
