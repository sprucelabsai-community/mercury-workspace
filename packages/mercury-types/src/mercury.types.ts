import AbstractSpruceError from '@sprucelabs/error'
import { ISchema, SchemaValues } from '@sprucelabs/schema'
import { SpruceSchemas } from '#spruce/schemas/schemas.types'
import { authorizerStatuses } from './constants'

export type DeepReadonly<T> = T extends (infer R)[]
	? DeepReadonlyArray<R>
	: // eslint-disable-next-line @typescript-eslint/ban-types
	T extends Function
	? T
	: T extends Record<string, any>
	? DeepReadonlyObject<T>
	: T
export interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}
export type DeepReadonlyObject<T> = {
	readonly [P in keyof T]: DeepReadonly<T[P]>
}
export type EventSignature = DeepReadonly<
	SpruceSchemas.MercuryTypes.v2020_09_01.IEventSignature
>
export type EventContract = DeepReadonly<
	SpruceSchemas.MercuryTypes.v2020_09_01.IEventContract
>
export type Permission = DeepReadonly<
	SpruceSchemas.MercuryTypes.v2020_09_01.IPermission
>
type Statuses = typeof authorizerStatuses
export type AuthorizerStatus = Statuses[number]['name']
export type PermissionContract = SpruceSchemas.MercuryTypes.v2020_09_01.IPermissionContract
export type MercuryAggregateResponse<Payload> = {
	totalContracts: number
	totalResponses: number
	totalErrors: number
	responses: MercurySingleResponse<Payload>[]
}
export interface MercurySingleResponse<Payload> {
	responderRef?: string
	errors?: AbstractSpruceError[]
	payload?: Payload
}
export type KeyOf<O> = Extract<keyof O, string>
export declare type ContractMapper<Contract extends EventContract> = {
	readonly [K in Contract['eventSignatures'][number]['eventNameWithOptionalNamespace']]: Contract['eventSignatures'][number] & {
		readonly eventNameWithOptionalNamespace: K
	}
}
export declare type EventNames<
	Contract extends EventContract,
	MappedContract extends ContractMapper<Contract> = ContractMapper<Contract>,
	EventName extends KeyOf<MappedContract> = KeyOf<MappedContract>
> = EventName
export declare type EmitCallback<
	MappedContract extends ContractMapper<EventContract> = ContractMapper<
		EventContract
	>,
	EventName extends KeyOf<MappedContract> = KeyOf<MappedContract>,
	IEventSignature extends DeepReadonly<
		EventSignature
	> = MappedContract[EventName],
	ResponseSchema extends ISchema = IEventSignature['responsePayload'] extends ISchema
		? IEventSignature['responsePayload']
		: never,
	ResponsePayload = ResponseSchema extends ISchema
		? SchemaValues<ResponseSchema>
		: never
> = (payload: MercurySingleResponse<ResponsePayload>) => void | Promise<void>
export default interface MercuryClient<Contract extends EventContract> {
	emit<
		MappedContract extends ContractMapper<Contract> = ContractMapper<Contract>,
		EventName extends KeyOf<MappedContract> = KeyOf<MappedContract>,
		IEventSignature extends EventSignature = MappedContract[EventName],
		EmitSchema extends ISchema = IEventSignature['emitPayload'] extends ISchema
			? IEventSignature['emitPayload']
			: never,
		ResponseSchema extends ISchema = IEventSignature['responsePayload'] extends ISchema
			? IEventSignature['responsePayload']
			: never
	>(
		eventName: EventName,
		payload: SchemaValues<EmitSchema>,
		cb?: EmitCallback<MappedContract, EventName>
	): Promise<MercuryAggregateResponse<SchemaValues<ResponseSchema>>>

	emit<
		MappedContract extends ContractMapper<Contract> = ContractMapper<Contract>,
		EventName extends KeyOf<MappedContract> = KeyOf<MappedContract>,
		IEventSignature extends EventSignature = MappedContract[EventName],
		ResponseSchema extends ISchema = IEventSignature['responsePayload'] extends ISchema
			? IEventSignature['responsePayload']
			: never
	>(
		eventName: EventName,
		cb?: EmitCallback<MappedContract, EventName>
	): Promise<MercuryAggregateResponse<SchemaValues<ResponseSchema>>>

	on<
		MappedContract extends ContractMapper<Contract> = ContractMapper<Contract>,
		EventName extends KeyOf<MappedContract> = KeyOf<MappedContract>,
		IEventSignature extends DeepReadonly<
			EventSignature
		> = MappedContract[EventName],
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
export {}
