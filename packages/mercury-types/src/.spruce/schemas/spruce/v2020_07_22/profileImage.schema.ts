import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'



const profileImageSchema: SpruceSchemas.Spruce.v2020_07_22.IProfileImageSchema  = {
	id: 'profileImage',
	version: 'v2020_07_22',
	namespace: 'Spruce',
	name: 'Profile Image Sizes',
	description: 'Various sizes that a profile image comes in.',
	    fields: {
	            /** 60x60. */
	            'profile60': {
	                label: '60x60',
	                type: 'text',
	                isRequired: true,
	                options: undefined
	            },
	            /** 150x150. */
	            'profile150': {
	                label: '150x150',
	                type: 'text',
	                isRequired: true,
	                options: undefined
	            },
	            /** 60x60. */
	            'profile60@2x': {
	                label: '60x60',
	                type: 'text',
	                isRequired: true,
	                options: undefined
	            },
	            /** 150x150. */
	            'profile150@2x': {
	                label: '150x150',
	                type: 'text',
	                isRequired: true,
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(profileImageSchema)

export default profileImageSchema
