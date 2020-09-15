import { SpruceSchemas } from '../../schemas.types'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'

import permissionSchema from '#spruce/schemas/mercuryTypes/v2020_09_01/permission.schema'

const permissionContractSchema: SpruceSchemas.MercuryTypes.v2020_09_01.IPermissionContractSchema  = {
	id: 'permissionContract',
	name: 'Permission Contract',
	    fields: {
	            /** . */
	            'permissions': {
	                type: FieldType.Schema,
	                isRequired: true,
	                isArray: true,
	                options: {schema: permissionSchema,}
	            },
	    }
}

export default permissionContractSchema
