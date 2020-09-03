import { buildSchema } from '@sprucelabs/schema'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import { authorizerStatuses } from '../../mercury.types'

export default buildSchema({
	id: 'permissionContract',
	name: 'Permission Contract',
	description: '',
	fields: {
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
})
