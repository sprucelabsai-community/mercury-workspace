import { buildErrorSchema } from '@sprucelabs/schema'

export default buildErrorSchema({
	id: 'invalidPayload',
	name: 'Invalid payload',
	description: '',
	fields: {
		fullyQualifiedEventName: {
			type: 'text',
			isRequired: true,
		},
	},
})
