import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'

import eventSignatureSchema from '#spruce/schemas/mercuryTypes/v2020_09_01/eventSignature.schema'

const eventSignaturesByNameSchema: SpruceSchemas.MercuryTypes.v2020_09_01.IEventSignaturesByNameSchema  = {
	id: 'eventSignaturesByName',
	version: 'v2020_09_01',
	namespace: 'MercuryTypes',
	name: '',
	dynamicFieldSignature: { 
	    type: 'schema',
	    keyName: 'eventName',
	    isRequired: true,
	    options: {schema: eventSignatureSchema,}
	}}

SchemaRegistry.getInstance().trackSchema(eventSignaturesByNameSchema)

export default eventSignaturesByNameSchema
