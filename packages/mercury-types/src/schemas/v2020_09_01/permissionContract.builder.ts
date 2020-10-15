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
	name: 'Permission contract',
	description: '',
	fields: {
		id: {
			type: 'text',
			isRequired: true,
		},
		name: {
			type: 'text',
			label: 'Name',
			isRequired: true,
			hint: 'Human readable name for this contract',
		},
		description: {
			type: 'text',
			label: 'Description',
		},
		requireAllPermissions: {
			type: 'boolean',
			label: 'Require all permissions',
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
						id: {
							type: 'text',
							label: 'id',
							isRequired: true,
							hint:
								'Hyphen separated di for this permission, e.g. can-unlock-doors',
						},
						name: {
							type: 'text',
							label: 'Name',
							isRequired: true,
							hint: 'Human readable name for this permission',
						},
						description: {
							type: 'text',
							label: 'Description',
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
