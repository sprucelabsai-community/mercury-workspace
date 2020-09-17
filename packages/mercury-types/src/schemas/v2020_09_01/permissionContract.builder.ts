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
