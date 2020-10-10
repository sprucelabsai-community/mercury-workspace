import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'

import skillCreatorSchema from '#spruce/schemas/spruce/v2020_07_22/skillCreator.schema'

const skillSchema: SpruceSchemas.Spruce.v2020_07_22.ISkillSchema  = {
	id: 'skill',
	version: 'v2020_07_22',
	namespace: 'Spruce',
	name: 'Skill',
	description: 'An ability Sprucebot has learned.',
	    fields: {
	            /** Id. */
	            'id': {
	                label: 'Id',
	                type: 'id',
	                isRequired: true,
	                options: undefined
	            },
	            /** Id. */
	            'apiKey': {
	                label: 'Id',
	                type: 'id',
	                isPrivate: true,
	                isRequired: true,
	                options: undefined
	            },
	            /** Name. */
	            'name': {
	                label: 'Name',
	                type: 'text',
	                isRequired: true,
	                options: undefined
	            },
	            /** Description. */
	            'description': {
	                label: 'Description',
	                type: 'text',
	                options: undefined
	            },
	            /** Slug. */
	            'slug': {
	                label: 'Slug',
	                type: 'text',
	                isRequired: true,
	                options: undefined
	            },
	            /** Creators. The people or skills who created and own this skill. */
	            'creators': {
	                label: 'Creators',
	                type: 'schema',
	                isPrivate: true,
	                isRequired: true,
	                hint: 'The people or skills who created and own this skill.',
	                isArray: true,
	                options: {schema: skillCreatorSchema,}
	            },
	            /** . */
	            'dateCreated': {
	                type: 'number',
	                isRequired: true,
	                options: undefined
	            },
	            /** . */
	            'dateDeleted': {
	                type: 'number',
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(skillSchema)

export default skillSchema
