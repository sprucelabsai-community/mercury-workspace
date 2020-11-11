/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-redeclare */

import { default as SchemaEntity } from '@sprucelabs/schema'
import * as SpruceSchema from '@sprucelabs/schema'





export declare namespace SpruceErrors.MercuryClient {

	
	export interface IInvalidEventName {
		
			
			'eventNameWithOptionalNamespace': string
	}

	export interface IInvalidEventNameSchema extends SpruceSchema.ISchema {
		id: 'invalidEventName',
		namespace: 'MercuryClient',
		name: 'Invalid event name',
		    fields: {
		            /** . */
		            'eventNameWithOptionalNamespace': {
		                type: 'text',
		                isRequired: true,
		                options: undefined
		            },
		    }
	}

	export type InvalidEventNameEntity = SchemaEntity<SpruceErrors.MercuryClient.IInvalidEventNameSchema>

}



export declare namespace SpruceErrors.MercuryClient {

	
	export interface IInvalidPayload {
		
	}

	export interface IInvalidPayloadSchema extends SpruceSchema.ISchema {
		id: 'invalidPayload',
		namespace: 'MercuryClient',
		name: 'Invalid payload',
		    fields: {
		    }
	}

	export type InvalidPayloadEntity = SchemaEntity<SpruceErrors.MercuryClient.IInvalidPayloadSchema>

}



export declare namespace SpruceErrors.MercuryClient {

	
	export interface IInvalidProtocol {
		
	}

	export interface IInvalidProtocolSchema extends SpruceSchema.ISchema {
		id: 'invalidProtocol',
		namespace: 'MercuryClient',
		name: 'Invalid protocol',
		    fields: {
		    }
	}

	export type InvalidProtocolEntity = SchemaEntity<SpruceErrors.MercuryClient.IInvalidProtocolSchema>

}



export declare namespace SpruceErrors.MercuryClient {

	
	export interface IUnexpectedPayload {
		
	}

	export interface IUnexpectedPayloadSchema extends SpruceSchema.ISchema {
		id: 'unexpectedPayload',
		namespace: 'MercuryClient',
		name: 'Unexpected payload',
		    fields: {
		    }
	}

	export type UnexpectedPayloadEntity = SchemaEntity<SpruceErrors.MercuryClient.IUnexpectedPayloadSchema>

}



export declare namespace SpruceErrors.MercuryClient {

	
	export interface IConnectionFailed {
		
			
			'host': string
			
			'statusCode': number
	}

	export interface IConnectionFailedSchema extends SpruceSchema.ISchema {
		id: 'connectionFailed',
		namespace: 'MercuryClient',
		name: 'Connection failed',
		    fields: {
		            /** . */
		            'host': {
		                type: 'text',
		                isRequired: true,
		                options: undefined
		            },
		            /** . */
		            'statusCode': {
		                type: 'number',
		                isRequired: true,
		                options: undefined
		            },
		    }
	}

	export type ConnectionFailedEntity = SchemaEntity<SpruceErrors.MercuryClient.IConnectionFailedSchema>

}




