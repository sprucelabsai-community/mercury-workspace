import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'

import eventTargetSchema from '#spruce/errors/mercuryClient/eventTarget.schema'

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
	                options: {schema: eventTargetSchema,}
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
