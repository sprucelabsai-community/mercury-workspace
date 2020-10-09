import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'



const permissionSchema: SpruceSchemas.MercuryTypes.v2020_09_01.IPermissionSchema  = {
	id: 'permission',
	version: 'v2020_09_01',
	namespace: 'MercuryTypes',
	name: 'Permission',
	    fields: {
	            /** Permission name. Hyphen separated name for this permission, e.g. can-unlock-doors */
	            'name': {
	                label: 'Permission name',
	                type: 'text',
	                isRequired: true,
	                hint: 'Hyphen separated name for this permission, e.g. can-unlock-doors',
	                options: undefined
	            },
	            /** Fallback to permission contract. If the person does not have a permission set (to them or their role), I will fallback to the permission contract defined here. Note: if a new permission is added to the contract, setting this to false will mean everybody fails checking for it. */
	            'fallbackToPermissionContractIfPermissionNotSet': {
	                label: 'Fallback to permission contract',
	                type: 'boolean',
	                hint: 'If the person does not have a permission set (to them or their role), I will fallback to the permission contract defined here. Note: if a new permission is added to the contract, setting this to false will mean everybody fails checking for it.',
	                defaultValue: true,
	                options: undefined
	            },
	            /** Match on. */
	            'match': {
	                label: 'Match on',
	                type: 'select',
	                defaultValue: "any",
	                options: {choices: [{"label":"All","value":"all"},{"label":"Any","value":"any"}],}
	            },
	            /** Clocked in. Is the person clocked in and ready to rock? */
	            'clockedIn': {
	                label: 'Clocked in',
	                type: 'boolean',
	                hint: 'Is the person clocked in and ready to rock?',
	                options: undefined
	            },
	            /** Clocked out. When someone is not working (off the clock). */
	            'clockedOut': {
	                label: 'Clocked out',
	                type: 'boolean',
	                hint: 'When someone is not working (off the clock).',
	                options: undefined
	            },
	            /** On premise. Are they at work (maybe working, maybe visiting). */
	            'onPrem': {
	                label: 'On premise',
	                type: 'boolean',
	                hint: 'Are they at work (maybe working, maybe visiting).',
	                options: undefined
	            },
	            /** Off premise. They aren't at the office or shop. */
	            'offPrem': {
	                label: 'Off premise',
	                type: 'boolean',
	                hint: 'They aren\'t at the office or shop.',
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(permissionSchema)

export default permissionSchema
