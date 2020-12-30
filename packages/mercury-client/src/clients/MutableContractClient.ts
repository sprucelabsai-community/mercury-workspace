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
	private static inMemoryContract: EventContract = { eventSignatures: {} }
	public static mixinContract(contract: EventContract) {
		const newContract = {
			eventSignatures: {
				...this.inMemoryContract.eventSignatures,
				...contract.eventSignatures,
			},
		} as const

		this.inMemoryContract = newContract
	}

	public mixinContract(contract: EventContract) {
		MutableContractClient.mixinContract(contract)
	}

	public handlesEvent(fullyQualifiedEventName: string) {
		try {
			this.getEventSignatureByName(fullyQualifiedEventName as any)
			return true
		} catch {
			return false
		}
	}

	protected getEventSignatureByName<EventName extends EventNames<Contract>>(
		fullyQualifiedEventName: EventName
	): EventSignature {
		try {
			const inMemorySig = eventContractUtil.getSignatureByName(
				MutableContractClient.inMemoryContract,
				fullyQualifiedEventName
			)

			return inMemorySig
		} catch (err) {
			const sig = this.eventContract
				? eventContractUtil.getSignatureByName(
						this.eventContract,
						fullyQualifiedEventName
				  )
				: {}

			return sig
		}
	}
}
