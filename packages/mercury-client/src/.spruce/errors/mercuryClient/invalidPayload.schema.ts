import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'



const invalidPayloadSchema: SpruceErrors.MercuryClient.InvalidPayloadSchema  = {
	id: 'invalidPayload',
	namespace: 'MercuryClient',
	name: 'Invalid payload',
	    fields: {
	            /** . */
	            'eventName': {
	                type: 'text',
	                isRequired: true,
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(invalidPayloadSchema)

export default invalidPayloadSchema
