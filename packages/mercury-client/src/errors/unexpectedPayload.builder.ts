import { buildErrorSchema } from '@sprucelabs/schema'

export default buildErrorSchema({
	id: 'unexpectedPayload',
	name: 'Unexpected payload',
	description: '',
	fields: {
		eventNameWithOptionalNamespace: {
			type: 'text',
			isRequired: true,
		},
	},
})
