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
	private static emitter: any
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
	}

	public async on(...args: any[]) {
		return MercuryTestClient.emitter.on(...args)
	}

	public async emit(...args: any[]) {
		if (MercuryTestClient.emitter.listenCount(args[0]) > 0) {
			return MercuryTestClient.emitter.emit(...args)
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
