import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'



const invalidEventNameSchema: SpruceErrors.MercuryClient.IInvalidEventNameSchema  = {
	id: 'invalidEventName',
	namespace: 'MercuryClient',
	name: 'Invalid event name',
	    fields: {
	            /** . */
	            'eventNameWithOptionalNamespace': {
	                type: 'text',
	                isRequired: true,
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(invalidEventNameSchema)

export default invalidEventNameSchema
