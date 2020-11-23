/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-redeclare */

import { default as SchemaEntity } from '@sprucelabs/schema'
import * as SpruceSchema from '@sprucelabs/schema'





export declare namespace SpruceErrors.MercuryTypes {

	
	export interface IInvalidEventName {
		
			
			'eventNameWithOptionalNamespace': string
			
			'validNames': string[]
	}

	export interface IInvalidEventNameSchema extends SpruceSchema.ISchema {
		id: 'invalidEventName',
		namespace: 'MercuryTypes',
		name: 'Invalid event name',
		    fields: {
		            /** . */
		            'eventNameWithOptionalNamespace': {
		                type: 'text',
		                isRequired: true,
		                options: undefined
		            },
		            /** . */
		            'validNames': {
		                type: 'text',
		                isRequired: true,
		                isArray: true,
		                options: undefined
		            },
		    }
	}

	export type InvalidEventNameEntity = SchemaEntity<SpruceErrors.MercuryTypes.IInvalidEventNameSchema>

}




