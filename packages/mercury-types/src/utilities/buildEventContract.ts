import { validateSchemaValues } from '@sprucelabs/schema'
import eventContractSchema from '#spruce/schemas/mercuryTypes/v2020_09_01/eventContract.schema'
import { EventContract } from '../mercury.types'

export default function buildEventContract<C extends EventContract>(
	contract: C
): C {
	validateSchemaValues(eventContractSchema, contract)
	return contract as C
}
