import {
	ContractMapper,
	EventContract,
	EventSignature,
	KeyOf,
} from '@sprucelabs/mercury-types'
import SpruceError from '../errors/SpruceError'
import MercurySocketIoClient from '../MercurySocketIoClient'

export default class MutableContractClient<
	Contract extends EventContract
> extends MercurySocketIoClient<Contract> {
	private static inMemoryContract: EventContract = { eventSignatures: [] }
	public static mixinContract(contract: EventContract) {
		const newContract = {
			eventSignatures: [
				...this.inMemoryContract.eventSignatures,
				...contract.eventSignatures,
			],
		} as const

		this.inMemoryContract = newContract
	}

	protected getEventSignatureByName<
		MappedContract extends ContractMapper<Contract> = ContractMapper<Contract>,
		EventName extends KeyOf<MappedContract> = KeyOf<MappedContract>
	>(eventName: EventName): EventSignature {
		const inMemorySig = MutableContractClient.inMemoryContract.eventSignatures.find(
			(sig) => sig.eventNameWithOptionalNamespace === eventName
		)

		if (inMemorySig) {
			return inMemorySig
		}

		const sig = this.eventContract.eventSignatures.find(
			(sig) => sig.eventNameWithOptionalNamespace === eventName
		)

		if (!sig) {
			throw new SpruceError({
				code: 'INVALID_EVENT_NAME',
				eventNameWithOptionalNamespace: eventName,
			})
		}

		return sig
	}
}
