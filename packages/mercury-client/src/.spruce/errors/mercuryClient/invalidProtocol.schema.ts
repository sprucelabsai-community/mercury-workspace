import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'



const invalidProtocolSchema: SpruceErrors.MercuryClient.InvalidProtocolSchema  = {
	id: 'invalidProtocol',
	namespace: 'MercuryClient',
	name: 'Invalid protocol',
	    fields: {
	            /** . */
	            'uri': {
	                type: 'text',
	                isRequired: true,
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(invalidProtocolSchema)

export default invalidProtocolSchema
