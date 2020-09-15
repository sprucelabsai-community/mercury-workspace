import { SpruceSchemas } from '../../schemas.types'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'

import permissionSchema from '#spruce/schemas/mercuryTypes/v2020_09_01/permission.schema'

const eventSignatureSchema: SpruceSchemas.MercuryTypes.v2020_09_01.IEventSignatureSchema  = {
	id: 'eventSignature',
	name: 'Event Signature',
	    fields: {
	            /** . */
	            'eventNameWithOptionalNamespace': {
	                type: FieldType.Text,
	                isRequired: true,
	                options: undefined
	            },
	            /** . */
	            'responsePayload': {
	                type: FieldType.Raw,
	                options: {valueType: `SpruceSchema.ISchema`,}
	            },
	            /** . */
	            'emitPayload': {
	                type: FieldType.Raw,
	                options: {valueType: `SpruceSchema.ISchema`,}
	            },
	            /** . */
	            'listenPermissionsAny': {
	                type: FieldType.Schema,
	                isArray: true,
	                options: {schema: permissionSchema,}
	            },
	            /** . */
	            'emitPermissionsAny': {
	                type: FieldType.Schema,
	                isArray: true,
	                options: {schema: permissionSchema,}
	            },
	    }
}

export default eventSignatureSchema
