import { SpruceSchemas } from '../../schemas.types'




const skillCreatorSchema: SpruceSchemas.Spruce.v2020_07_22.ISkillCreatorSchema  = {
	id: 'skillCreator',
	name: 'Skill creator',
	    fields: {
	            /** . */
	            'skillId': {
	                type: 'text',
	                options: undefined
	            },
	            /** . */
	            'personId': {
	                type: 'text',
	                options: undefined
	            },
	    }
}

export default skillCreatorSchema
