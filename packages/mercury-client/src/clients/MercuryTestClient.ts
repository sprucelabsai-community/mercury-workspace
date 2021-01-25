import { AbstractEventEmitter } from '@sprucelabs/mercury-event-emitter'
import { EventContract, EventNames } from '@sprucelabs/mercury-types'
import MutableContractClient from './MutableContractClient'

class InternalEmitter<
	Contract extends EventContract
> extends AbstractEventEmitter<Contract> {
	public listenCount(eventName: EventNames<Contract>) {
		return (this.listenersByEvent[eventName] || []).length
	}
}

export default class MercuryTestClient<
	Contract extends EventContract
> extends MutableContractClient<Contract> {
	private emitter: any
	public constructor(
		options: Record<string, any> & { host: string; eventContract?: Contract }
	) {
		super(options)
		this.emitter = new InternalEmitter(
			options.eventContract ?? { eventSignatures: {} }
		)
	}

	public mixinContract(contract: EventContract) {
		MutableContractClient.mixinContract(contract)
	}

	public async on(...args: any[]) {
		return this.emitter.on(...args)
	}

	public async emit(...args: any[]) {
		if (this.emitter.listenCount(args[0]) > 0) {
			return this.emitter.emit(...args)
		} else {
			if (!super.isConnected()) {
				await super.connect()
			}

			//@ts-ignore
			return super.emit(...args)
		}
	}

	public async connect() {}
}
