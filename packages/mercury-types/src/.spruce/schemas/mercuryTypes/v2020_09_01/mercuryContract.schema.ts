import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'

import eventSignatureSchema from '#spruce/schemas/mercuryTypes/v2020_09_01/eventSignature.schema'

const mercuryContractSchema: SpruceSchemas.MercuryTypes.v2020_09_01.IMercuryContractSchema  = {
	id: 'mercuryContract',
	version: 'v2020_09_01',
	namespace: 'MercuryTypes',
	name: 'Mercury Contract',
	    fields: {
	            /** . */
	            'eventSignatures': {
	                type: 'schema',
	                isRequired: true,
	                isArray: true,
	                options: {schema: eventSignatureSchema,}
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(mercuryContractSchema)

export default mercuryContractSchema
