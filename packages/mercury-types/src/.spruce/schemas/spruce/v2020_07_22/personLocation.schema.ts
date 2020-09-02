import { SpruceSchemas } from '../../schemas.types'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'

import jobSchema from '#spruce/schemas/spruce/v2020_07_22/job.schema'
import locationSchema from '#spruce/schemas/spruce/v2020_07_22/location.schema'
import personSchema from '#spruce/schemas/spruce/v2020_07_22/person.schema'

const personLocationSchema: SpruceSchemas.Spruce.v2020_07_22.IPersonLocationSchema  = {
	id: 'personLocation',
	name: 'Person location',
	description: 'A person\'s visit to a location (business or home).',
	    fields: {
	            /** Id. */
	            'id': {
	                label: 'Id',
	                type: FieldType.Id,
	                options: undefined
	            },
	            /** Name. */
	            'roles': {
	                label: 'Name',
	                type: FieldType.Select,
	                isRequired: true,
	                isArray: true,
	                options: {choices: [{"value":"owner","label":"Owner"},{"value":"groupManager","label":"District/region manager"},{"value":"manager","label":"Manager"},{"value":"teammate","label":"Teammate"},{"value":"guest","label":"Guest"}],}
	            },
	            /** Status. */
	            'status': {
	                label: 'Status',
	                type: FieldType.Text,
	                options: undefined
	            },
	            /** Total visits. */
	            'visits': {
	                label: 'Total visits',
	                type: FieldType.Number,
	                isRequired: true,
	                options: {choices: [{"value":"owner","label":"Owner"},{"value":"groupManager","label":"District/region manager"},{"value":"manager","label":"Manager"},{"value":"teammate","label":"Teammate"},{"value":"guest","label":"Guest"}],}
	            },
	            /** Last visit. */
	            'lastRecordedVisit': {
	                label: 'Last visit',
	                type: FieldType.DateTime,
	                options: undefined
	            },
	            /** Job. */
	            'job': {
	                label: 'Job',
	                type: FieldType.Schema,
	                isRequired: true,
	                options: {schema: jobSchema,}
	            },
	            /** Location. */
	            'location': {
	                label: 'Location',
	                type: FieldType.Schema,
	                isRequired: true,
	                options: {schema: locationSchema,}
	            },
	            /** Person. */
	            'person': {
	                label: 'Person',
	                type: FieldType.Schema,
	                isRequired: true,
	                options: {schema: personSchema,}
	            },
	    }
}

export default personLocationSchema
