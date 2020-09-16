import { MercuryContract } from '../mercury.types'

export default function buildMercuryContract<Contract extends MercuryContract>(
	contract: Contract
): Contract {
	return contract
}
