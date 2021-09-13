import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'

import unauthorizedTargetSchema_v2021_09_13 from '#spruce/errors/spruceEventUtils/v2021_09_13/unauthorizedTarget.schema'

const unauthorizedAccessSchema: SpruceErrors.MercuryClient.UnauthorizedAccessSchema  = {
	id: 'unauthorizedAccess',
	namespace: 'MercuryClient',
	name: 'Unauthorized Access',
	    fields: {
	            /** . */
	            'fqen': {
	                type: 'text',
	                isRequired: true,
	                options: undefined
	            },
	            /** . */
	            'action': {
	                type: 'select',
	                isRequired: true,
	                options: {choices: [{"value":"emit","label":"emit"}],}
	            },
	            /** . */
	            'target': {
	                type: 'schema',
	                isRequired: true,
	                options: {schema: unauthorizedTargetSchema_v2021_09_13,}
	            },
	            /** . */
	            'permissionContractId': {
	                type: 'id',
	                isRequired: true,
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(unauthorizedAccessSchema)

export default unauthorizedAccessSchema
