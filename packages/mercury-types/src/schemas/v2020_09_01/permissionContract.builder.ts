import { buildSchema } from '@sprucelabs/schema'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import { authorizerStatuses } from '../../constants'

export default buildSchema({
	id: 'permissionContract',
	name: 'Permission Contract',
	description: '',
	fields: {
		permissionAccesses: {
			type: FieldType.Schema,
			isRequired: true,
			isArray: true,
			options: {
				schema: {
					id: 'permissionAccess',
					name: 'Permission access',
					fields: {
						name: {
							type: FieldType.Text,
							label: 'Permission name',
							hint:
								'Hyphen separated name for this permission, e.g. can-unlock-doors',
						},
						...authorizerStatuses.reduce((fields, status) => {
							const { name, ...props } = status
							// @ts-ignore
							fields[name] = {
								...props,
								type: FieldType.Boolean,
							}

							return fields
						}, {}),
					},
				},
			},
		},
	},
})
