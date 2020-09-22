import { SpruceSchemas } from '../../schemas.types'



import eventSignatureSchema from '#spruce/schemas/mercuryTypes/v2020_09_01/eventSignature.schema'

const mercuryContractSchema: SpruceSchemas.MercuryTypes.v2020_09_01.IMercuryContractSchema  = {
	id: 'mercuryContract',
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

export default mercuryContractSchema
