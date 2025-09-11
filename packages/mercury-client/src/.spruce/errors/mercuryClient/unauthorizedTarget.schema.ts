import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'



const unauthorizedTargetSchema: SpruceErrors.MercuryClient.UnauthorizedTargetSchema  = {
	id: 'unauthorizedTarget',
	namespace: 'MercuryClient',
	name: '',
	    fields: {
	            /** . */
	            'locationId': {
	                type: 'id',
	                options: undefined
	            },
	            /** . */
	            'personId': {
	                type: 'id',
	                options: undefined
	            },
	            /** . */
	            'organizationId': {
	                type: 'id',
	                options: undefined
	            },
	            /** . */
	            'skillId': {
	                type: 'id',
	                options: undefined
	            },
	            /** . */
	            'roleId': {
	                type: 'id',
	                options: undefined
	            },
	            /** . */
	            'email': {
	                type: 'email',
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(unauthorizedTargetSchema)

export default unauthorizedTargetSchema
