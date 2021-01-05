import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'



const timeoutSchema: SpruceErrors.MercuryClient.TimeoutSchema  = {
	id: 'timeout',
	namespace: 'MercuryClient',
	name: 'Timeout',
	    fields: {
	            /** . */
	            'eventName': {
	                type: 'text',
	                isRequired: true,
	                options: undefined
	            },
	            /** . */
	            'timeoutMs': {
	                type: 'number',
	                isRequired: true,
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(timeoutSchema)

export default timeoutSchema
