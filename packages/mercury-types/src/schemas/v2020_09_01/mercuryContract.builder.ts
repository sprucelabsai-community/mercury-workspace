import { buildSchema } from '@sprucelabs/schema'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'

export default buildSchema({
	id: 'mercuryContract',
	name: 'Mercury Contract',
	description: '',
	fields: {
		eventSignatures: {
			type: FieldType.Schema,
			isRequired: true,
			isArray: true,
			options: {
				schema: {
					id: 'eventSignature',
					name: 'Event Signature',
					description: '',
					fields: {
						eventNameWithOptionalNamespace: {
							type: FieldType.Text,
							isRequired: true,
						},
						responsePayload: {
							type: FieldType.Raw,
							options: { valueType: 'SpruceSchema.ISchema' },
						},
						emitPayload: {
							type: FieldType.Raw,
							options: { valueType: 'SpruceSchema.ISchema' },
						},
						listenPermissionsAny: {
							type: FieldType.Schema,
							options: {
								schemaId: { id: 'permissionContract', version: 'v2020_09_01' },
							},
						},
						emitPermissionsAny: {
							type: FieldType.Schema,
							options: {
								schemaId: { id: 'permissionContract', version: 'v2020_09_01' },
							},
						},
					},
				},
			},
		},
	},
})
