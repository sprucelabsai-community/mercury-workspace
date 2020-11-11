import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'



const invalidPayloadSchema: SpruceErrors.MercuryClient.IInvalidPayloadSchema  = {
	id: 'invalidPayload',
	namespace: 'MercuryClient',
	name: 'Invalid payload',
	    fields: {
	    }
}

SchemaRegistry.getInstance().trackSchema(invalidPayloadSchema)

export default invalidPayloadSchema
