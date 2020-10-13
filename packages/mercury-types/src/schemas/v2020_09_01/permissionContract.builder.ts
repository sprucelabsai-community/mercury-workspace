import { buildSchema, schemaChoicesToHash } from '@sprucelabs/schema'
import { roleSchema } from '@sprucelabs/spruce-core-schemas'
import { authorizerStatuses } from '../../constants'

const statusFields = authorizerStatuses.reduce((fields, status) => {
	const { name, ...props } = status
	// @ts-ignore
	fields[name] = {
		...props,
		type: 'boolean',
	}

	return fields
}, {})

const statusFlagsSchema = buildSchema({
	id: 'statusFlags',
	fields: {
		default: {
			type: 'boolean',
			hint: 'What is the fallback if no status is set?',
		},
		...statusFields,
	},
})

const roleBases = schemaChoicesToHash(roleSchema, 'base')

const defaultsByRoleSchema = buildSchema({
	id: 'defaultsByRole',
	fields: {
		...Object.keys(roleBases).reduce((fields, baseSlug) => {
			//@ts-ignore
			fields[baseSlug] = {
				//@ts-ignore
				label: roleBases[baseSlug],
				type: 'schema',
				options: {
					schema: statusFlagsSchema,
				},
			}
			return fields
		}, {}),
	},
})

export default buildSchema({
	id: 'permissionContract',
	name: 'Permission Contract',
	description: '',
	fields: {
		requireAllPermissions: {
			type: 'boolean',
			defaultValue: false,
		},
		permissions: {
			type: 'schema',
			isRequired: true,
			isArray: true,
			options: {
				schema: {
					id: 'permission',
					name: 'Permission',
					fields: {
						name: {
							type: 'text',
							label: 'Permission name',
							isRequired: true,
							hint:
								'Hyphen separated name for this permission, e.g. can-unlock-doors',
						},
						requireAllStatuses: {
							type: 'boolean',
							label: 'Require all statuses',
							defaultValue: false,
						},
						defaultsByRoleBase: {
							type: 'schema',
							options: {
								schema: defaultsByRoleSchema,
							},
						},
						can: {
							type: 'schema',
							options: {
								schema: statusFlagsSchema,
							},
						},
					},
				},
			},
		},
	},
})
