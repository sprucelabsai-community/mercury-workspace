import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'



const statusFlagsSchema: SpruceSchemas.MercuryTypes.v2020_09_01.IStatusFlagsSchema  = {
	id: 'statusFlags',
	version: 'v2020_09_01',
	namespace: 'MercuryTypes',
	name: '',
	    fields: {
	            /** . What is the fallback if no status is set? */
	            'default': {
	                type: 'boolean',
	                hint: 'What is the fallback if no status is set?',
	                options: undefined
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

SchemaRegistry.getInstance().trackSchema(statusFlagsSchema)

export default statusFlagsSchema
