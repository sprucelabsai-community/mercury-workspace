import { buildSchema } from '@sprucelabs/schema'

export default buildSchema({
	id: 'mercuryContract',
	name: 'Mercury Contract',
	description: '',
	fields: {
		eventSignatures: {
			type: 'schema',
			isRequired: true,
			isArray: true,
			options: {
				schema: {
					id: 'eventSignature',
					name: 'Event Signature',
					description: '',
					fields: {
						eventNameWithOptionalNamespace: {
							type: 'text',
							isRequired: true,
						},
						responsePayload: {
							type: 'raw',
							options: { valueType: 'SpruceSchema.ISchema' },
						},
						emitPayload: {
							type: 'raw',
							options: { valueType: 'SpruceSchema.ISchema' },
						},
						listenPermissions: {
							type: 'schema',
							isArray: true,
							options: {
								schemaId: { id: 'permission', version: 'v2020_09_01' },
							},
						},
						emitPermissions: {
							type: 'schema',
							isArray: true,
							options: {
								schemaId: { id: 'permission', version: 'v2020_09_01' },
							},
						},
					},
				},
			},
		},
	},
})
