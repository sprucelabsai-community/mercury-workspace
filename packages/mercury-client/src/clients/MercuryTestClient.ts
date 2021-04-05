import { AbstractEventEmitter } from '@sprucelabs/mercury-event-emitter'
import { EventContract } from '@sprucelabs/mercury-types'
import { Schema } from '@sprucelabs/schema'
import { EventSource } from '@sprucelabs/spruce-event-utils'
import MutableContractClient from './MutableContractClient'

class InternalEmitter<
	Contract extends EventContract
> extends AbstractEventEmitter<Contract> {
	public reset() {
		this.listenersByEvent = {}
	}

	protected validatePayload(
		schema: Schema | undefined | null,
		actualPayload: any,
		eventName: string
	) {
		const payload = { ...actualPayload }
		delete payload.source
		return super.validatePayload(schema, payload, eventName)
	}
}

export default class MercuryTestClient<
	Contract extends EventContract
> extends MutableContractClient<Contract> {
	private static emitter: any
	private _isConnected = false
	private isConnectedToApi = false

	public constructor(
		options: Record<string, any> & { host: string; eventContract?: Contract }
	) {
		super(options)
		if (!MercuryTestClient.emitter) {
			MercuryTestClient.emitter = new InternalEmitter(
				options.eventContract ?? { eventSignatures: {} }
			)
		}
	}

	public static resetContracts() {
		MutableContractClient.resetContracts()
		MercuryTestClient.emitter?.resetContracts()
	}

	public mixinContract(contract: EventContract) {
		MutableContractClient.mixinContract(contract)
		MercuryTestClient.emitter.mixinContract(contract)
	}

	public resetContracts() {
		MercuryTestClient.resetContracts()
	}

	public async on(...args: any[]) {
		return MercuryTestClient.emitter.on(...args)
	}

	public async emit(...args: any[]) {
		if (MercuryTestClient.emitter.listenCount(args[0]) > 0) {
			const source: EventSource = {}
			if (this.auth?.person) {
				source.personId = this.auth.person.id
			}

			if (this.auth?.skill) {
				source.skillId = this.auth.skill.id
			}

			const argsWithSource = [...args]
			argsWithSource[1] = {
				...argsWithSource[1],
				source,
			}
			return MercuryTestClient.emitter.emit(...argsWithSource)
		} else {
			if (!super.isConnected()) {
				this.isConnectedToApi = true
				await super.connect()
			}

			//@ts-ignore
			return super.emit(...args)
		}
	}

	public async connect() {
		this._isConnected = true
	}

	public isConnected() {
		return this._isConnected
	}

	public async disconnect() {
		if (this.isConnectedToApi) {
			await super.disconnect()
		}

		this._isConnected = false
	}

	public static reset() {
		MercuryTestClient.emitter?.reset()
		MercuryTestClient.resetContracts()
	}
}
