import { buildErrorSchema } from '@sprucelabs/schema'
import invalidPayloadBuilder from './invalidPayload.builder'

export default buildErrorSchema({
	id: 'invalidResponsePayload',
	name: 'Invalid response payload',
	description: '',
	fields: {
		...invalidPayloadBuilder.fields,
	},
})
