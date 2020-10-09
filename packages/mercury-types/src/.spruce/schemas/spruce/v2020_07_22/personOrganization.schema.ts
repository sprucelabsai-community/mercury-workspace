import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'



const personOrganizationSchema: SpruceSchemas.Spruce.v2020_07_22.IPersonOrganizationSchema  = {
	id: 'personOrganization',
	version: 'v2020_07_22',
	namespace: 'Spruce',
	name: 'Person <-> organization relationship',
	    fields: {
	            /** Id. */
	            'id': {
	                label: 'Id',
	                type: 'id',
	                isRequired: true,
	                options: undefined
	            },
	            /** Name. */
	            'roleIds': {
	                label: 'Name',
	                type: 'id',
	                isRequired: true,
	                isArray: true,
	                options: undefined
	            },
	            /** Organization. */
	            'organizationId': {
	                label: 'Organization',
	                type: 'id',
	                isRequired: true,
	                options: undefined
	            },
	            /** Person. */
	            'personId': {
	                label: 'Person',
	                type: 'id',
	                isRequired: true,
	                options: undefined
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

SchemaRegistry.getInstance().trackSchema(personOrganizationSchema)

export default personOrganizationSchema
