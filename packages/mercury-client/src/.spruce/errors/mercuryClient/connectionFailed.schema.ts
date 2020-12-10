import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'



const connectionFailedSchema: SpruceErrors.MercuryClient.ConnectionFailedSchema  = {
	id: 'connectionFailed',
	namespace: 'MercuryClient',
	name: 'Connection failed',
	    fields: {
	            /** . */
	            'host': {
	                type: 'text',
	                isRequired: true,
	                options: undefined
	            },
	            /** . */
	            'statusCode': {
	                type: 'number',
	                isRequired: true,
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(connectionFailedSchema)

export default connectionFailedSchema
