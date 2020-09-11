import { SpruceSchemas } from '../../schemas.types'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'

import permissionContractSchema from '#spruce/schemas/mercuryTypes/v2020_09_01/permissionContract.schema'

const eventSignatureSchema: SpruceSchemas.MercuryTypes.v2020_09_01.IEventSignatureSchema  = {
	id: 'eventSignature',
	name: 'Event Signature',
	    fields: {
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
	                options: {schema: permissionContractSchema,}
	            },
	            /** . */
	            'emitPermissionsAny': {
	                type: FieldType.Schema,
	                options: {schema: permissionContractSchema,}
	            },
	    }
}

export default eventSignatureSchema
