import { AbstractEventEmitter } from '@sprucelabs/mercury-event-emitter'
import { EventContract } from '@sprucelabs/mercury-types'
import MutableContractClient from './MutableContractClient'

class InternalEmitter<
	Contract extends EventContract
> extends AbstractEventEmitter<Contract> {
	public reset() {
		this.listenersByEvent = {}
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

	public mixinContract(contract: EventContract) {
		MutableContractClient.mixinContract(contract)
		MercuryTestClient.emitter.mixinContract(contract)
	}

	public async on(...args: any[]) {
		return MercuryTestClient.emitter.on(...args)
	}

	public async emit(...args: any[]) {
		if (MercuryTestClient.emitter.listenCount(args[0]) > 0) {
			return MercuryTestClient.emitter.emit(...args)
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
	}
}
