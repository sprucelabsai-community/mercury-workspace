import AbstractSpruceError from '@sprucelabs/error'
import {
	ContractMapper,
	EmitCallback,
	EventSignature,
	KeyOf,
	MercuryAggregateResponse,
	MercuryClient,
	MercuryContract,
	DeepReadonly,
	MercurySingleResponse,
} from '@sprucelabs/mercury-types'
import { ISchema, SchemaValues, validateSchemaValues } from '@sprucelabs/schema'
import SpruceError from './errors/SpruceError'

export default class AbstractEventEmitter<Contract extends MercuryContract>
	implements MercuryClient<Contract> {
	private contract: MercuryContract

	protected listenersByEvent: Record<
		string,
		((payload?: any) => any | Promise<any>)[]
	> = {}

	public constructor(contract: MercuryContract) {
		this.contract = contract
	}

	public async emit<
		MappedContract extends ContractMapper<Contract> = ContractMapper<Contract>,
		EventName extends KeyOf<MappedContract> = KeyOf<MappedContract>,
		IEventSignature extends DeepReadonly<EventSignature> = DeepReadonly<
			MappedContract[EventName]
		>,
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
		payload?:
			| (EmitSchema extends SchemaValues<EmitSchema>
					? SchemaValues<EmitSchema>
					: never)
			| EmitCallback<MappedContract, EventName>,
		cb?: EmitCallback<MappedContract, EventName>
	): Promise<MercuryAggregateResponse<ResponsePayload>> {
		const { actualPayload, actualCallback } = this.normalizePayloadAndCallback(
			payload,
			cb
		)

		const eventSignature = this.findEventSignatureByName(eventName)
		const emitSchema = eventSignature.emitPayload

		this.validatePayload(emitSchema, actualPayload, eventName)

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

				if (response.error) {
					totalErrors++
				}

				return response
			})
		)

		return {
			totalContracts: listeners.length,
			totalResponses: listeners.length,
			totalErrors,
			responses,
		} as MercuryAggregateResponse<ResponsePayload>
	}

	private async emitOne<
		EventName extends KeyOf<MappedContract>,
		MappedContract extends ContractMapper<Contract> = ContractMapper<Contract>,
		IEventSignature extends DeepReadonly<EventSignature> = DeepReadonly<
			MappedContract[EventName]
		>,
		ResponseSchema extends ISchema = IEventSignature['responsePayload'] extends ISchema
			? IEventSignature['responsePayload']
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
				emitCallbackPayload.error = error
			}

			await (options.actualCallback as EmitCallback<MappedContract, EventName>)(
				emitCallbackPayload
			)
		}

		const response: Partial<MercurySingleResponse<ResponsePayload>> = {
			payload: responsePayload,
		}

		if (error) {
			response.error = error
		}

		return response
	}

	private validatePayload(
		schema: DeepReadonly<ISchema> | undefined | null,
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

	private getValidEventNames() {
		return this.contract.eventSignatures.map(
			(e) => e.eventNameWithOptionalNamespace
		)
	}

	private findEventSignatureByName(eventName: string) {
		const sig = this.contract.eventSignatures.find(
			(sig) => sig.eventNameWithOptionalNamespace === eventName
		)

		if (!sig) {
			const validNames = this.getValidEventNames()
			throw new SpruceError({ code: 'INVALID_EVENT_NAME', validNames })
		}

		return sig
	}

	private normalizePayloadAndCallback(payload: any, cb: any) {
		const actualPayload = typeof payload !== 'function' ? payload : undefined
		const actualCallback = typeof payload === 'function' ? payload : cb
		return { actualPayload, actualCallback }
	}

	public on<
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
	) {
		if (!this.listenersByEvent[eventName]) {
			this.listenersByEvent[eventName] = []
		}

		this.listenersByEvent[eventName].push(cb)
	}

	public off(
		eventName: Extract<
			Contract['eventSignatures'][number]['eventNameWithOptionalNamespace'],
			string
		>,
		cb?: () => void
	): number {
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
