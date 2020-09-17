import { SpruceSchemas } from '../../schemas.types'




const aclSchema: SpruceSchemas.Spruce.v2020_07_22.IAclSchema  = {
	id: 'acl',
	name: 'Access control list',
	dynamicFieldSignature: { 
	    label: 'Permissions grouped by slug',
	    type: 'text',
	    keyName: 'slug',
	    isArray: true,
	    options: undefined
	}}

export default aclSchema
