import { buildErrorSchema } from '@sprucelabs/schema'

export default buildErrorSchema({
	id: 'unexpectedPayload',
	name: 'Unexpected payload',
	description: '',
	fields: {
		fullyQualifiedEventName: {
			type: 'text',
			isRequired: true,
		},
	},
})
