import { SpruceSchemas } from '../../schemas.types'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'

import permissionAccessSchema from '#spruce/schemas/mercuryTypes/v2020_09_01/permissionAccess.schema'

const permissionContractSchema: SpruceSchemas.MercuryTypes.v2020_09_01.IPermissionContractSchema  = {
	id: 'permissionContract',
	name: 'Permission Contract',
	dynamicFieldSignature: { 
	    type: FieldType.Schema,
	    keyName: 'permissionName',
	    isRequired: true,
	    options: {schema: permissionAccessSchema,}
	}}

export default permissionContractSchema
