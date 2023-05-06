import { buildSchema } from '@sprucelabs/schema'

const statusChangePayloadSchema = buildSchema({
	id: 'connectionStatusChangeEmitPayload',
	fields: {
		status: {
			type: 'select',
			isRequired: true,
			options: {
				choices: [
					{
						label: 'Connecting',
						value: 'connecting',
					} as const,
					{
						label: 'Connected',
						value: 'connected',
					} as const,
					{
						label: 'Disconnected',
						value: 'disconnected',
					} as const,
				],
			},
		},
	},
})
const statusChangeTargetAndPayloadSchema = buildSchema({
	id: 'connectionStatusChangeEmitTargetAndPayload',
	fields: {
		payload: {
			type: 'schema',
			isRequired: true,
			options: { schema: statusChangePayloadSchema },
		},
	},
})
type StatusChangeTargetAndPayloadSchema =
	typeof statusChangeTargetAndPayloadSchema

declare module '@sprucelabs/mercury-types/build/types/mercury.types' {
	interface SkillEventSignatures {
		'connection-status-change': {
			emitPayloadSchema: StatusChangeTargetAndPayloadSchema
		}
	}
}
