import {
	ContractMapper,
	EmitCallback,
	EventSignature,
	KeyOf,
	MercuryAggregateResponse,
	MercuryClient,
	MercuryContract,
} from '@sprucelabs/mercury-types'
import { ISchema, SchemaValues } from '@sprucelabs/schema'

export default class AbstractEventEmitter<Contract extends MercuryContract>
	implements MercuryClient<Contract> {
	private contract: MercuryContract

	protected listenersByEvent: Record<
		string,
		((payload?: any) => any | Promise<any>)[]
	> = {}

	public constructor(contract: MercuryContract) {
		this.contract = contract
		console.log(this.contract)
	}

	public async emit<
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
		payload:
			| (EmitPayload extends SchemaValues<EmitSchema>
					? SchemaValues<EmitSchema>
					: never)
			| EmitCallback<MappedContract, EventName>
			| undefined,
		cb?: EmitCallback<MappedContract, EventName> | undefined
	): Promise<MercuryAggregateResponse<ResponsePayload>> {
		console.log(eventName, payload, cb)
		const listeners = this.listenersByEvent[eventName] || []
		const responses = await Promise.all(listeners.map((cb) => cb(payload)))

		return {
			totalContracts: listeners.length,
			totalResponses: listeners.length,
			responses,
		} as MercuryAggregateResponse<ResponsePayload>
	}

	public on<
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
