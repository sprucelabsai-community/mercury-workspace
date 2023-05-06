import { buildEventContract } from '@sprucelabs/mercury-types'
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

type StatusChangePayloadSchema = typeof statusChangePayloadSchema

declare module '@sprucelabs/mercury-types/build/types/mercury.types' {
	interface SkillEventSignatures {
		'connection-status-change': {
			emitPayloadSchema: StatusChangeTargetAndPayloadSchema
		}
	}
}

export const connectionStatusContract = buildEventContract({
	id: 'connectionStatus',
	eventSignatures: {
		'connection-status-change': {
			emitPayloadSchema: statusChangeTargetAndPayloadSchema,
		},
	},
})

export type ConnectionStatus =
	StatusChangePayloadSchema['fields']['status']['options']['choices'][number]['value']
