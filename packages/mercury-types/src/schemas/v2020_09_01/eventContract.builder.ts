import { buildSchema } from '@sprucelabs/schema'

export default buildSchema({
	id: 'eventContract',
	name: 'Event contract',
	description: '',
	fields: {
		eventSignatures: {
			type: 'schema',
			isRequired: true,
			options: {
				schema: {
					id: 'eventSignaturesByName',
					dynamicFieldSignature: {
						keyName: 'eventName',
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'eventSignature',
								name: 'Event Signature',
								description: '',
								fields: {
									responsePayloadSchema: {
										type: 'raw',
										options: { valueType: 'SpruceSchema.ISchema' },
									},
									emitPayloadSchema: {
										type: 'raw',
										options: { valueType: 'SpruceSchema.ISchema' },
									},
									listenPermissionContract: {
										type: 'schema',
										options: {
											schemaId: {
												id: 'permissionContract',
												version: 'v2020_09_01',
											},
										},
									},
									emitPermissionContract: {
										type: 'schema',
										options: {
											schemaId: {
												id: 'permissionContract',
												version: 'v2020_09_01',
											},
										},
									},
								},
							},
						},
					},
				},
			},
		},
	},
})
