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
	            /** Role ids. */
	            'roleIds': {
	                label: 'Role ids',
	                type: 'id',
	                isRequired: true,
	                isArray: true,
	                options: undefined
	            },
	            /** Organization id. */
	            'organizationId': {
	                label: 'Organization id',
	                type: 'id',
	                isRequired: true,
	                options: undefined
	            },
	            /** Person id. */
	            'personId': {
	                label: 'Person id',
	                type: 'id',
	                isRequired: true,
	                options: undefined
	            },
	            /** Date created. */
	            'dateCreated': {
	                label: 'Date created',
	                type: 'number',
	                isRequired: true,
	                options: undefined
	            },
	            /** Date deleted. */
	            'dateDeleted': {
	                label: 'Date deleted',
	                type: 'number',
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(personOrganizationSchema)

export default personOrganizationSchema
