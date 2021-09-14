import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../../errors.types'



const unauthorizedTargetSchema: SpruceErrors.SpruceEventUtils.v2021_09_13.UnauthorizedTargetSchema  = {
	id: 'unauthorizedTarget',
	version: 'v2021_09_13',
	namespace: 'SpruceEventUtils',
	name: 'event target',
	importsWhenRemote: ['import \'@sprucelabs/spruce-event-utils\'',],
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
	    }
}

SchemaRegistry.getInstance().trackSchema(unauthorizedTargetSchema)

export default unauthorizedTargetSchema
