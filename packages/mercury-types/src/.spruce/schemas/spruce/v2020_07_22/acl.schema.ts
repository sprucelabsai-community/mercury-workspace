import { SpruceSchemas } from '../../schemas.types'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'



const aclSchema: SpruceSchemas.Spruce.v2020_07_22.IAclSchema  = {
	id: 'acl',
	name: 'Access control list',
	dynamicFieldSignature: { 
	    label: 'Permissions grouped by slug',
	    type: FieldType.Text,
	    keyName: 'slug',
	    isArray: true,
	    options: undefined
	}}

export default aclSchema
