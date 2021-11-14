import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'



const notConnectedSchema: SpruceErrors.MercuryClient.NotConnectedSchema  = {
	id: 'notConnected',
	namespace: 'MercuryClient',
	name: 'Not connected',
	    fields: {
	            /** . */
	            'action': {
	                type: 'text',
	                isRequired: true,
	                options: undefined
	            },
	            /** . */
	            'fqen': {
	                type: 'id',
	                isRequired: true,
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(notConnectedSchema)

export default notConnectedSchema
