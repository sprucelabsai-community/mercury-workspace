import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'

import permissionSchema from '#spruce/schemas/mercuryTypes/v2020_09_01/permission.schema'

const permissionContractSchema: SpruceSchemas.MercuryTypes.v2020_09_01.IPermissionContractSchema  = {
	id: 'permissionContract',
	version: 'v2020_09_01',
	namespace: 'MercuryTypes',
	name: 'Permission contract',
	    fields: {
	            /** . */
	            'id': {
	                type: 'text',
	                isRequired: true,
	                options: undefined
	            },
	            /** Name. Human readable name for this contract */
	            'name': {
	                label: 'Name',
	                type: 'text',
	                isRequired: true,
	                hint: 'Human readable name for this contract',
	                options: undefined
	            },
	            /** Description. */
	            'description': {
	                label: 'Description',
	                type: 'text',
	                options: undefined
	            },
	            /** Require all permissions. */
	            'requireAllPermissions': {
	                label: 'Require all permissions',
	                type: 'boolean',
	                defaultValue: false,
	                options: undefined
	            },
	            /** . */
	            'permissions': {
	                type: 'schema',
	                isRequired: true,
	                isArray: true,
	                options: {schema: permissionSchema,}
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(permissionContractSchema)

export default permissionContractSchema
