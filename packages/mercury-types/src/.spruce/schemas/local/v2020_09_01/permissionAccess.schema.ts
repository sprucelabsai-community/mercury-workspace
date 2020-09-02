import { SpruceSchemas } from '../../schemas.types'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'



const permissionAccessSchema: SpruceSchemas.Local.v2020_09_01.IPermissionAccessSchema  = {
	id: 'permissionAccess',
	name: 'Permission Access',
	dynamicKeySignature: { 
	    type: FieldType.Boolean,
	    key: 'status',
	    options: undefined
	}}

export default permissionAccessSchema
