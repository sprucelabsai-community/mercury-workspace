import AbstractSpruceError from '@sprucelabs/error'
import { ISchema, SchemaValues } from '@sprucelabs/schema'
import { SpruceSchemas } from '#spruce/schemas/schemas.types'
import { authorizerStatuses } from './constants'

export type EventContract = SpruceSchemas.MercuryTypes.v2020_09_01.IEventContract
export type EventSignature = SpruceSchemas.MercuryTypes.v2020_09_01.IEventSignature
export type Permission = SpruceSchemas.MercuryTypes.v2020_09_01.IPermission
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
export declare type EventNames<Contract extends EventContract> = KeyOf<
	Contract['eventSignatures']
>

export declare type EmitCallback<
	Contract extends EventContract,
	EventName extends EventNames<Contract>,
	IEventSignature extends EventSignature = Contract['eventSignatures'][EventName],
	ResponseSchema extends ISchema = IEventSignature['responsePayloadSchema'] extends ISchema
		? IEventSignature['responsePayloadSchema']
		: never,
	ResponsePayload = ResponseSchema extends ISchema
		? SchemaValues<ResponseSchema>
		: never
> = (payload: MercurySingleResponse<ResponsePayload>) => void | Promise<void>
export default interface MercuryEventEmitter<Contract extends EventContract> {
	emit<
		EventName extends KeyOf<Contract['eventSignatures']> = KeyOf<
			Contract['eventSignatures']
		>,
		IEventSignature extends EventSignature = Contract['eventSignatures'][EventName],
		EmitSchema extends ISchema = IEventSignature['emitPayloadSchema'] extends ISchema
			? IEventSignature['emitPayloadSchema']
			: never,
		ResponseSchema extends ISchema = IEventSignature['responsePayloadSchema'] extends ISchema
			? IEventSignature['responsePayloadSchema']
			: never
	>(
		eventName: EventName,
		payload: SchemaValues<EmitSchema>,
		cb?: EmitCallback<Contract, EventName>
	): Promise<MercuryAggregateResponse<SchemaValues<ResponseSchema>>>

	emit<
		EventName extends KeyOf<Contract['eventSignatures']> = KeyOf<
			Contract['eventSignatures']
		>,
		IEventSignature extends EventSignature = Contract['eventSignatures'][EventName],
		ResponseSchema extends ISchema = IEventSignature['responsePayloadSchema'] extends ISchema
			? IEventSignature['responsePayloadSchema']
			: never
	>(
		eventName: EventName,
		cb?: EmitCallback<Contract, EventName>
	): Promise<MercuryAggregateResponse<SchemaValues<ResponseSchema>>>

	on<
		EventName extends KeyOf<Contract['eventSignatures']> = KeyOf<
			Contract['eventSignatures']
		>,
		IEventSignature extends EventSignature = Contract['eventSignatures'][EventName],
		EmitSchema extends ISchema = IEventSignature['emitPayloadSchema'] extends ISchema
			? IEventSignature['emitPayloadSchema']
			: never
	>(
		eventName: EventName,
		cb: (
			payload: EmitSchema extends ISchema ? SchemaValues<EmitSchema> : never
		) => IEventSignature['responsePayloadSchema'] extends ISchema
			?
					| Promise<SchemaValues<IEventSignature['responsePayloadSchema']>>
					| SchemaValues<IEventSignature['responsePayloadSchema']>
			: Promise<void> | void
	): Promise<void>

	off(
		eventName: EventNames<Contract>,
		cb?: (payload?: Record<string, any>) => void
	): Promise<number>
}
