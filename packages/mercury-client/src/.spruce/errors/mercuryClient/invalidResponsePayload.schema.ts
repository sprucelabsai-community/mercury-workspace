import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'



const invalidResponsePayloadSchema: SpruceErrors.MercuryClient.InvalidResponsePayloadSchema  = {
	id: 'invalidResponsePayload',
	namespace: 'MercuryClient',
	name: 'Invalid response payload',
	    fields: {
	            /** . */
	            'eventName': {
	                type: 'text',
	                isRequired: true,
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(invalidResponsePayloadSchema)

export default invalidResponsePayloadSchema
