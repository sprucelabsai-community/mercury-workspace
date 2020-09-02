import { SpruceSchemas } from '../../schemas.types'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'

import permissionAccessSchema from '#spruce/schemas/local/v2020_09_01/permissionAccess.schema'

const permissionContractSchema: SpruceSchemas.Local.v2020_09_01.IPermissionContractSchema  = {
	id: 'permissionContract',
	name: 'Permission Contract',
	dynamicKeySignature: { 
	    type: FieldType.Schema,
	    key: 'name',
	    options: {schema: permissionAccessSchema,}
	}}

export default permissionContractSchema
