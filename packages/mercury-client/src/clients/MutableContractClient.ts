import {
	EventContract,
	EventSignature,
	EventNames,
} from '@sprucelabs/mercury-types'
import { eventContractUtil } from '@sprucelabs/spruce-event-utils'
import MercurySocketIoClient from './MercurySocketIoClient'

export default class MutableContractClient<
	Contract extends EventContract
> extends MercurySocketIoClient<Contract> {
	private static inMemoryContract?: EventContract
	public static mixinContract(contract: EventContract) {
		const newContract = {
			eventSignatures: {
				...(this.inMemoryContract?.eventSignatures ?? {}),
				...contract.eventSignatures,
			},
		} as const

		this.inMemoryContract = newContract
	}

	public mixinContract(contract: EventContract) {
		MutableContractClient.mixinContract(contract)
	}

	public handlesEvent(eventName: string) {
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
