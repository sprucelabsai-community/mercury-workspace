import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'



const invalidEventNameSchema: SpruceErrors.MercuryTypes.IInvalidEventNameSchema  = {
	id: 'invalidEventName',
	namespace: 'MercuryTypes',
	name: 'Invalid event name',
	    fields: {
	            /** . */
	            'eventNameWithOptionalNamespace': {
	                type: 'text',
	                isRequired: true,
	                options: undefined
	            },
	            /** . */
	            'validNames': {
	                type: 'text',
	                isRequired: true,
	                isArray: true,
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(invalidEventNameSchema)

export default invalidEventNameSchema
