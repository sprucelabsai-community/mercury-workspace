import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'



const invalidProtocolSchema: SpruceErrors.MercuryClient.IInvalidProtocolSchema  = {
	id: 'invalidProtocol',
	namespace: 'MercuryClient',
	name: 'Invalid protocol',
	    fields: {
	    }
}

SchemaRegistry.getInstance().trackSchema(invalidProtocolSchema)

export default invalidProtocolSchema
