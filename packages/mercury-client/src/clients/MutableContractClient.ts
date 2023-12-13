import {
	EventContract,
	EventSignature,
	EventNames,
} from '@sprucelabs/mercury-types'
import { eventContractUtil } from '@sprucelabs/spruce-event-utils'
import MercurySocketIoClient from './MercurySocketIoClient'

export default class MutableContractClient<
	Contract extends EventContract,
> extends MercurySocketIoClient<Contract> {
	private static inMemoryContract?: EventContract
	public static mixinContract(contract: EventContract) {
		this.inMemoryContract = eventContractUtil.unifyContracts([
			this.inMemoryContract ?? { eventSignatures: {} },
			contract,
		])
	}

	public mixinContract(contract: EventContract) {
		MutableContractClient.mixinContract(contract)
	}

	public static reset() {
		this.inMemoryContract = {
			eventSignatures: {},
		}
	}

	public doesHandleEvent(eventName: string) {
		try {
			this.getEventSignatureByName(eventName as any)
			return true
		} catch {
			return false
		}
	}

	protected getEventSignatureByName<EventName extends EventNames<Contract>>(
		eventName: EventName
	): EventSignature {
		try {
			const sig =
				this.eventContract || MutableContractClient.inMemoryContract
					? eventContractUtil.getSignatureByName(
							this.eventContract ?? { eventSignatures: {} },
							eventName
						)
					: {}

			return sig
		} catch (err) {
			const inMemorySig = eventContractUtil.getSignatureByName(
				MutableContractClient.inMemoryContract ?? { eventSignatures: {} },
				eventName
			)

			return inMemorySig
		}
	}
}
