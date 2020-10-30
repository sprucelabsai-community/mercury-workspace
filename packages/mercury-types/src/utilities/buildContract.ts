import { validateSchemaValues } from '@sprucelabs/schema'
import eventContractSchema from '#spruce/schemas/mercuryTypes/v2020_09_01/eventContract.schema'
import { EventContract } from '../mercury.types'

export default function buildContract<C extends EventContract>(contract: C) {
	validateSchemaValues(eventContractSchema, contract)
	return contract
}
