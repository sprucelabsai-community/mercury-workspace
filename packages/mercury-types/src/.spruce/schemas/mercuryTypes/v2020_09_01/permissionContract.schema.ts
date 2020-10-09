import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'

import permissionSchema from '#spruce/schemas/mercuryTypes/v2020_09_01/permission.schema'

const permissionContractSchema: SpruceSchemas.MercuryTypes.v2020_09_01.IPermissionContractSchema  = {
	id: 'permissionContract',
	version: 'v2020_09_01',
	namespace: 'MercuryTypes',
	name: 'Permission Contract',
	    fields: {
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
