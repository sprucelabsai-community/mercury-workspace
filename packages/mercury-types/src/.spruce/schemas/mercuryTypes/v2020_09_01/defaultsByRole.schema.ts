import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'

import statusFlagsSchema from '#spruce/schemas/mercuryTypes/v2020_09_01/statusFlags.schema'

const defaultsByRoleSchema: SpruceSchemas.MercuryTypes.v2020_09_01.IDefaultsByRoleSchema  = {
	id: 'defaultsByRole',
	version: 'v2020_09_01',
	namespace: 'MercuryTypes',
	name: '',
	    fields: {
	            /** Owner. */
	            'owner': {
	                label: 'Owner',
	                type: 'schema',
	                options: {schema: statusFlagsSchema,}
	            },
	            /** Group manager. */
	            'groupManager': {
	                label: 'Group manager',
	                type: 'schema',
	                options: {schema: statusFlagsSchema,}
	            },
	            /** Manager. */
	            'manager': {
	                label: 'Manager',
	                type: 'schema',
	                options: {schema: statusFlagsSchema,}
	            },
	            /** Teammate. */
	            'teammate': {
	                label: 'Teammate',
	                type: 'schema',
	                options: {schema: statusFlagsSchema,}
	            },
	            /** Guest. */
	            'guest': {
	                label: 'Guest',
	                type: 'schema',
	                options: {schema: statusFlagsSchema,}
	            },
	            /** Anonymous. */
	            'anonymous': {
	                label: 'Anonymous',
	                type: 'schema',
	                options: {schema: statusFlagsSchema,}
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(defaultsByRoleSchema)

export default defaultsByRoleSchema
