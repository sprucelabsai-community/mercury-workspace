import { buildSchema } from '@sprucelabs/schema'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'

export default buildSchema({
	id: 'permissionContract',
	name: 'Permission Contract',
	description: '',
	dynamicKeySignature: {
		type: FieldType.Schema,
		key: 'name',
		options: {
			schema: {
				id: 'permissionAccess',
				name: 'Permission Access',
				dynamicKeySignature: {
					type: FieldType.Boolean,
					key: 'status',
				},
			},
		},
	},
})
