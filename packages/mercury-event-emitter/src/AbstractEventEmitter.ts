import AbstractSpruceError from '@sprucelabs/error'
import {
	EmitCallback,
	EventSignature,
	MercuryAggregateResponse,
	MercuryEventEmitter,
	EventContract,
	MercurySingleResponse,
	EventNames,
	eventContractUtil,
} from '@sprucelabs/mercury-types'
import { ISchema, SchemaValues, validateSchemaValues } from '@sprucelabs/schema'
import SpruceError from './errors/SpruceError'

export default class AbstractEventEmitter<Contract extends EventContract>
	implements MercuryEventEmitter<Contract> {
	private eventContract: EventContract

	protected listenersByEvent: Record<
		string,
		((payload?: any) => any | Promise<any>)[]
	> = {}

	public constructor(contract: EventContract) {
		this.eventContract = contract
	}

	public async emit<
		EventName extends EventNames<Contract>,
		IEventSignature extends EventSignature = Contract['eventSignatures'][EventName],
		EmitSchema extends ISchema = IEventSignature['emitPayloadSchema'] extends ISchema
			? IEventSignature['emitPayloadSchema']
			: never,
		ResponseSchema extends ISchema = IEventSignature['responsePayloadSchema'] extends ISchema
			? IEventSignature['responsePayloadSchema']
			: never
	>(
		eventName: EventName,
		payload?:
			| (EmitSchema extends SchemaValues<EmitSchema>
					? SchemaValues<EmitSchema>
					: never)
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

		this.validatePayload(
			emitSchema,

			actualPayload,
			eventName
		)

		const listeners = this.listenersByEvent[eventName] || []
		let totalErrors = 0

		const responses = await Promise.all(
			listeners.map(async (listenerCb, idx) => {
				const response = await this.emitOne<EventName>({
					idx,
					listenerCb,
					payload: actualPayload,
					totalContracts: listeners.length,
					actualCallback,
				})

				if (response.errors) {
					totalErrors += response.errors.length
				}

				return response
			})
		)

		return {
			totalContracts: listeners.length,
			totalResponses: listeners.length,
			totalErrors,
			responses,
		} as MercuryAggregateResponse<SchemaValues<ResponseSchema>>
	}

	private async emitOne<
		EventName extends EventNames<Contract>,
		IEventSignature extends EventSignature = Contract['eventSignatures'][EventName],
		ResponseSchema extends ISchema = IEventSignature['responsePayloadSchema'] extends ISchema
			? IEventSignature['responsePayloadSchema']
			: never,
		ResponsePayload = ResponseSchema extends ISchema
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
		} catch (err) {
			error = new SpruceError({
				code: 'LISTENER_ERROR',
				originalError: err,
				listenerIdx: options.idx,
			})
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

	private validatePayload(
		schema: ISchema | undefined | null,
		actualPayload: any,
		eventName: string
	) {
		if (schema) {
			try {
				//@ts-ignore
				validateSchemaValues(schema, actualPayload ?? {})
			} catch (err) {
				throw new SpruceError({
					code: 'INVALID_PAYLOAD',
					originalError: err,
					eventNameWithOptionalNamespace: eventName,
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
	) {
		if (!this.listenersByEvent[eventName]) {
			this.listenersByEvent[eventName] = []
		}

		this.listenersByEvent[eventName].push(cb)
	}

	public async off(
		eventName: EventNames<Contract>,
		cb?: () => void
	): Promise<number> {
		if (cb) {
			let found = false
			this.listenersByEvent[eventName] = this.listenersByEvent[
				eventName
			]?.filter((listener) => {
				if (listener === cb) {
					found = true
					return true
				}
				return false
			})

			return found ? 1 : 0
		} else {
			const total = (this.listenersByEvent[eventName] || []).length
			delete this.listenersByEvent[eventName]
			return total
		}
	}
}
