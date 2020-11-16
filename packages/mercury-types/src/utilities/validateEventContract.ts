import { validateSchemaValues } from '@sprucelabs/schema'
import eventContractSchema from '#spruce/schemas/mercuryTypes/v2020_09_01/eventContract.schema'
import { EventContract } from '../mercury.types'

export default function validateEventContract<C extends EventContract>(
	contract: C
): asserts contract is C {
	validateSchemaValues(eventContractSchema, contract)
}
