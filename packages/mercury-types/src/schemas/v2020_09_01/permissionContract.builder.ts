import { buildSchema } from '@sprucelabs/schema'
import { authorizerStatuses } from '../../constants'

export default buildSchema({
	id: 'permissionContract',
	name: 'Permission Contract',
	description: '',
	fields: {
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
						fallbackToPermissionContractIfPermissionNotSet: {
							type: 'boolean',
							label: 'Fallback to permission contract',
							hint: `If the person does not have a permission set (to them or their role), I will fallback to the permission contract defined here. Note: if a new permission is added to the contract, setting this to false will mean everybody fails checking for it.`,
							defaultValue: true,
						},
						match: {
							type: 'select',
							label: 'Match on',
							defaultValue: 'any',
							options: {
								choices: [
									{
										label: 'All',
										value: 'all',
									},
									{
										label: 'Any',
										value: 'any',
									},
								],
							},
						},
						...authorizerStatuses.reduce((fields, status) => {
							const { name, ...props } = status
							// @ts-ignore
							fields[name] = {
								...props,
								type: 'boolean',
							}

							return fields
						}, {}),
					},
				},
			},
		},
	},
})
