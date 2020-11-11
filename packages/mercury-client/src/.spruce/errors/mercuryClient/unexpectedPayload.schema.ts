import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'



const unexpectedPayloadSchema: SpruceErrors.MercuryClient.IUnexpectedPayloadSchema  = {
	id: 'unexpectedPayload',
	namespace: 'MercuryClient',
	name: 'Unexpected payload',
	    fields: {
	    }
}

SchemaRegistry.getInstance().trackSchema(unexpectedPayloadSchema)

export default unexpectedPayloadSchema
