import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'

import jobSchema from '#spruce/schemas/spruce/v2020_07_22/job.schema'
import locationSchema from '#spruce/schemas/spruce/v2020_07_22/location.schema'
import personSchema from '#spruce/schemas/spruce/v2020_07_22/person.schema'

const personLocationSchema: SpruceSchemas.Spruce.v2020_07_22.IPersonLocationSchema  = {
	id: 'personLocation',
	version: 'v2020_07_22',
	namespace: 'Spruce',
	name: 'Person location',
	description: 'A person\'s visit to a location (business or home).',
	    fields: {
	            /** Id. */
	            'id': {
	                label: 'Id',
	                type: 'id',
	                options: undefined
	            },
	            /** Name. */
	            'roles': {
	                label: 'Name',
	                type: 'select',
	                isRequired: true,
	                isArray: true,
	                options: {choices: [{"value":"owner","label":"Owner"},{"value":"groupManager","label":"District/region manager"},{"value":"manager","label":"Manager"},{"value":"teammate","label":"Teammate"},{"value":"guest","label":"Guest"}],}
	            },
	            /** Status. */
	            'status': {
	                label: 'Status',
	                type: 'text',
	                options: undefined
	            },
	            /** Total visits. */
	            'visits': {
	                label: 'Total visits',
	                type: 'number',
	                isRequired: true,
	                options: {choices: [{"value":"owner","label":"Owner"},{"value":"groupManager","label":"District/region manager"},{"value":"manager","label":"Manager"},{"value":"teammate","label":"Teammate"},{"value":"guest","label":"Guest"}],}
	            },
	            /** Last visit. */
	            'lastRecordedVisit': {
	                label: 'Last visit',
	                type: 'dateTime',
	                options: undefined
	            },
	            /** Job. */
	            'job': {
	                label: 'Job',
	                type: 'schema',
	                isRequired: true,
	                options: {schema: jobSchema,}
	            },
	            /** Location. */
	            'location': {
	                label: 'Location',
	                type: 'schema',
	                isRequired: true,
	                options: {schema: locationSchema,}
	            },
	            /** Person. */
	            'person': {
	                label: 'Person',
	                type: 'schema',
	                isRequired: true,
	                options: {schema: personSchema,}
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(personLocationSchema)

export default personLocationSchema
