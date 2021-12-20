import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'



const mustCreateEventSchema: SpruceErrors.MercuryClient.MustCreateEventSchema  = {
	id: 'mustCreateEvent',
	namespace: 'MercuryClient',
	name: 'must create event',
	    fields: {
	            /** . */
	            'fqen': {
	                type: 'text',
	                isRequired: true,
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(mustCreateEventSchema)

export default mustCreateEventSchema
