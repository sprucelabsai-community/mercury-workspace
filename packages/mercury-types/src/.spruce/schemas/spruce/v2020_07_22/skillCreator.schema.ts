import { SpruceSchemas } from '../../schemas.types'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'



const skillCreatorSchema: SpruceSchemas.Spruce.v2020_07_22.ISkillCreatorSchema  = {
	id: 'skillCreator',
	name: 'Skill creator',
	    fields: {
	            /** . */
	            'skillId': {
	                type: FieldType.Text,
	                options: undefined
	            },
	            /** . */
	            'personId': {
	                type: FieldType.Text,
	                options: undefined
	            },
	    }
}

export default skillCreatorSchema
