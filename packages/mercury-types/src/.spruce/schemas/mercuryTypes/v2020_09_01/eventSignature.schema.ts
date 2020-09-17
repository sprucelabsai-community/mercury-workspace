import { SpruceSchemas } from '../../schemas.types'


import permissionSchema from '#spruce/schemas/mercuryTypes/v2020_09_01/permission.schema'

const eventSignatureSchema: SpruceSchemas.MercuryTypes.v2020_09_01.IEventSignatureSchema  = {
	id: 'eventSignature',
	name: 'Event Signature',
	    fields: {
	            /** . */
	            'eventNameWithOptionalNamespace': {
	                type: 'text',
	                isRequired: true,
	                options: undefined
	            },
	            /** . */
	            'responsePayload': {
	                type: 'raw',
	                options: {valueType: `SpruceSchema.ISchema`,}
	            },
	            /** . */
	            'emitPayload': {
	                type: 'raw',
	                options: {valueType: `SpruceSchema.ISchema`,}
	            },
	            /** . */
	            'listenPermissionsAny': {
	                type: 'schema',
	                isArray: true,
	                options: {schema: permissionSchema,}
	            },
	            /** . */
	            'emitPermissionsAny': {
	                type: 'schema',
	                isArray: true,
	                options: {schema: permissionSchema,}
	            },
	    }
}

export default eventSignatureSchema
