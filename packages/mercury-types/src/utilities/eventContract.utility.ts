import SpruceError from '../errors/SpruceError'
import { EventContract, EventNames, EventSignature } from '../mercury.types'

const eventContractUtil = {
	getEventNames(contract: EventContract) {
		return Object.keys(contract.eventSignatures)
	},

	getNamedEventSignatures(
		contract: EventContract
	): {
		eventNameWithOptionalNamespace: string
		signature: EventSignature
	}[] {
		const names = this.getEventNames(contract)
		return names.map((name) => ({
			eventNameWithOptionalNamespace: name,
			signature: contract.eventSignatures[name],
		}))
	},

	getSignatureByName<Contract extends EventContract>(
		contract: Contract,
		eventNameWithOptionalNamespace: EventNames<Contract>
	) {
		const match = this.getNamedEventSignatures(contract).find(
			(event) =>
				event.eventNameWithOptionalNamespace === eventNameWithOptionalNamespace
		)

		if (!match) {
			throw new SpruceError({
				code: 'INVALID_EVENT_NAME',
				eventNameWithOptionalNamespace,
				validNames: this.getEventNames(contract),
			})
		}

		return match.signature
	},
}

export default eventContractUtil
