import { SpruceSchemas } from '../../schemas.types'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'

import eventSignatureSchema from '#spruce/schemas/mercuryTypes/v2020_09_01/eventSignature.schema'

const mercuryContractSchema: SpruceSchemas.MercuryTypes.v2020_09_01.IMercuryContractSchema  = {
	id: 'mercuryContract',
	name: 'Mercury Contract',
	dynamicFieldSignature: { 
	    type: FieldType.Schema,
	    keyName: 'eventNameWithOptionalNamespace',
	    options: {schema: eventSignatureSchema,}
	}}

export default mercuryContractSchema
