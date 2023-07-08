import AbstractSpruceError from '@sprucelabs/error'
import {
	EmitCallback,
	EventSignature,
	MercuryAggregateResponse,
	MercuryEventEmitter,
	EventContract,
	MercurySingleResponse,
	EventNames,
	ListenerCallback,
} from '@sprucelabs/mercury-types'
import { Schema, SchemaValues, validateSchemaValues } from '@sprucelabs/schema'
import {
	eventContractUtil,
	eventResponseUtil,
} from '@sprucelabs/spruce-event-utils'
import SpruceError from './errors/SpruceError'

export default class AbstractEventEmitter<Contract extends EventContract>
	implements MercuryEventEmitter<Contract>
{
	private shouldEmitSequentally: boolean

	protected eventContract: EventContract
	protected listenersByEvent: Record<
		string,
		((payload?: any) => any | Promise<any>)[]
	> = {}

	public constructor(
		contract: EventContract,
		options?: { shouldEmitSequentally?: boolean }
	) {
		this.eventContract = contract
		this.shouldEmitSequentally = options?.shouldEmitSequentally ?? false
	}

	public async emit<
		EventName extends EventNames<Contract>,
		IEventSignature extends EventSignature = Contract['eventSignatures'][EventName],
		EmitSchema extends Schema = IEventSignature['emitPayloadSchema'] extends Schema
			? IEventSignature['emitPayloadSchema']
			: never,
		ResponseSchema extends Schema = IEventSignature['responsePayloadSchema'] extends Schema
			? IEventSignature['responsePayloadSchema']
			: never
	>(
		eventName: EventName,
		payload?:
			| (EmitSchema extends Schema ? SchemaValues<EmitSchema> : never)
			| EmitCallback<Contract, EventName>,
		cb?: EmitCallback<Contract, EventName>
	): Promise<MercuryAggregateResponse<SchemaValues<ResponseSchema>>> {
		const { actualPayload, actualCallback } = this.normalizePayloadAndCallback(
			payload,
			cb
		)

		const eventSignature = eventContractUtil.getSignatureByName(
			this.eventContract,
			eventName
		)
		const emitSchema = eventSignature.emitPayloadSchema
		const responseSchema = eventSignature.responsePayloadSchema

		this.validateEmitPayload(emitSchema, actualPayload, eventName)

		const listeners = this.listenersByEvent[eventName] || []
		let totalErrors = 0

		const emitOneAndValidate = async (listenerCb: any, idx: number) => {
			let response = await this.emitOne<EventName>({
				idx,
				listenerCb,
				payload: actualPayload,
				totalContracts: listeners.length,
				actualCallback,
			})

			if (responseSchema && !response.errors) {
				try {
					this.validateResponsePayload(
						responseSchema,
						response.payload ?? {},
						eventName
					)
				} catch (err: any) {
					response = {
						errors: [err],
					}
				}
			}

			if (response.errors) {
				totalErrors += response.errors.length
			}

			return response
		}

		let responses: any

		if (this.shouldEmitSequentally) {
			responses = []
			let idx = 0
			for (const listener of listeners) {
				const response = await emitOneAndValidate(listener, idx)
				responses.push(response)
				idx++
			}
		} else {
			responses = await Promise.all(
				listeners.map(async (listenerCb, idx) =>
					emitOneAndValidate(listenerCb, idx)
				)
			)
		}

		return {
			totalContracts: listeners.length,
			totalResponses: listeners.length,
			totalErrors,
			responses,
		} as MercuryAggregateResponse<SchemaValues<ResponseSchema>>
	}

	public async emitAndFlattenResponses<
		EventName extends EventNames<Contract>,
		IEventSignature extends EventSignature = Contract['eventSignatures'][EventName],
		EmitSchema extends Schema = IEventSignature['emitPayloadSchema'] extends Schema
			? IEventSignature['emitPayloadSchema']
			: never,
		ResponseSchema extends Schema = IEventSignature['responsePayloadSchema'] extends Schema
			? IEventSignature['responsePayloadSchema']
			: never
	>(
		eventName: EventName,
		payload?:
			| (EmitSchema extends Schema ? SchemaValues<EmitSchema> : never)
			| EmitCallback<Contract, EventName>,
		cb?: EmitCallback<Contract, EventName>
	): Promise<SchemaValues<ResponseSchema>[]> {
		const results = await this.emit(eventName, payload, cb)

		if (results.totalResponses === 0) {
			return []
		}

		const { payloads, errors } =
			eventResponseUtil.getAllResponsePayloadsAndErrors(results, SpruceError)

		if (errors?.[0]) {
			throw errors[0]
		}

		return payloads as any
	}

	private async emitOne<
		EventName extends EventNames<Contract>,
		IEventSignature extends EventSignature = Contract['eventSignatures'][EventName],
		ResponseSchema extends Schema = IEventSignature['responsePayloadSchema'] extends Schema
			? IEventSignature['responsePayloadSchema']
			: never,
		ResponsePayload = ResponseSchema extends Schema
			? SchemaValues<ResponseSchema>
			: never
	>(options: {
		idx: number
		listenerCb: (payload?: any) => Promise<ResponsePayload>
		actualCallback?: () => void
		payload?: Record<string, any>
		totalContracts: number
	}): Promise<Partial<MercurySingleResponse<ResponsePayload>>> {
		let responsePayload: ResponsePayload | undefined
		let error: AbstractSpruceError<any> | undefined

		try {
			responsePayload = await options.listenerCb(options.payload)
		} catch (err: any) {
			if (err instanceof AbstractSpruceError) {
				error = err
			} else {
				error = new SpruceError({
					code: 'LISTENER_ERROR',
					originalError: err,
					listenerIdx: options.idx,
				})
			}
		}

		if (typeof options.actualCallback === 'function') {
			const emitCallbackPayload: MercurySingleResponse<any> = {}

			if (responsePayload) {
				emitCallbackPayload.payload = responsePayload
			}

			if (error) {
				emitCallbackPayload.errors = [error]
			}

			await (options.actualCallback as EmitCallback<Contract, EventName>)(
				emitCallbackPayload
			)
		}

		const response: Partial<MercurySingleResponse<ResponsePayload>> = {
			payload: responsePayload,
		}

		if (error) {
			response.errors = [error]
		}

		return response
	}

	public listenCount(eventName: EventNames<Contract>) {
		return (this.listenersByEvent[eventName] || []).length
	}

	public mixinContract(contract: EventContract) {
		this.eventContract = eventContractUtil.unifyContracts([
			this.eventContract,
			contract,
		]) as EventContract
	}

	protected validateEmitPayload(
		schema: Schema | undefined | null,
		actualPayload: any,
		eventName: string
	) {
		if (schema) {
			try {
				//@ts-ignore
				validateSchemaValues(schema, actualPayload ?? {})
			} catch (err: any) {
				throw new SpruceError({
					code: 'INVALID_PAYLOAD',
					originalError: err,
					eventName,
				})
			}
		}
	}

	protected validateResponsePayload(
		schema: Schema | undefined | null,
		actualPayload: any,
		eventName: string
	) {
		if (schema) {
			try {
				//@ts-ignore
				validateSchemaValues(schema, actualPayload ?? {})
			} catch (err: any) {
				throw new SpruceError({
					code: 'INVALID_RESPONSE_PAYLOAD',
					originalError: err,
					eventName,
				})
			}
		}
	}

	private normalizePayloadAndCallback(payload: any, cb: any) {
		const actualPayload = typeof payload !== 'function' ? payload : undefined
		const actualCallback = typeof payload === 'function' ? payload : cb
		return { actualPayload, actualCallback }
	}

	public async on<
		EventName extends EventNames<Contract>,
		IEventSignature extends EventSignature = Contract['eventSignatures'][EventName]
	>(eventName: EventName, cb: ListenerCallback<IEventSignature>) {
		eventContractUtil.getSignatureByName(this.eventContract, eventName)

		if (!this.listenersByEvent[eventName]) {
			this.listenersByEvent[eventName] = []
		}

		this.listenersByEvent[eventName].push(cb)
	}

	public async off(eventName: EventNames<Contract>, cb?: any): Promise<number> {
		if (cb) {
			let numForgotten = 0
			this.listenersByEvent[eventName] = this.listenersByEvent[
				eventName
			]?.filter((listener) => {
				if (listener === cb) {
					numForgotten++
					return false
				}
				return true
			})

			return numForgotten
		} else {
			const total = (this.listenersByEvent[eventName] || []).length
			delete this.listenersByEvent[eventName]
			return total
		}
	}
}
