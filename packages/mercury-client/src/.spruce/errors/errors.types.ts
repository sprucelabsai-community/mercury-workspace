/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-redeclare */

import { default as SchemaEntity } from '@sprucelabs/schema'
import * as SpruceSchema from '@sprucelabs/schema'





export declare namespace SpruceErrors.MercuryClient {

	
	export interface InvalidPayload {
		
			
			'eventNameWithOptionalNamespace': string
	}

	export interface InvalidPayloadSchema extends SpruceSchema.Schema {
		id: 'invalidPayload',
		namespace: 'MercuryClient',
		name: 'Invalid payload',
		    fields: {
		            /** . */
		            'eventNameWithOptionalNamespace': {
		                type: 'text',
		                isRequired: true,
		                options: undefined
		            },
		    }
	}

	export type InvalidPayloadEntity = SchemaEntity<SpruceErrors.MercuryClient.InvalidPayloadSchema>

}



export declare namespace SpruceErrors.MercuryClient {

	
	export interface UnexpectedPayload {
		
			
			'eventNameWithOptionalNamespace': string
	}

	export interface UnexpectedPayloadSchema extends SpruceSchema.Schema {
		id: 'unexpectedPayload',
		namespace: 'MercuryClient',
		name: 'Unexpected payload',
		    fields: {
		            /** . */
		            'eventNameWithOptionalNamespace': {
		                type: 'text',
		                isRequired: true,
		                options: undefined
		            },
		    }
	}

	export type UnexpectedPayloadEntity = SchemaEntity<SpruceErrors.MercuryClient.UnexpectedPayloadSchema>

}



export declare namespace SpruceErrors.MercuryClient {

	
	export interface InvalidProtocol {
		
	}

	export interface InvalidProtocolSchema extends SpruceSchema.Schema {
		id: 'invalidProtocol',
		namespace: 'MercuryClient',
		name: 'Invalid protocol',
		    fields: {
		    }
	}

	export type InvalidProtocolEntity = SchemaEntity<SpruceErrors.MercuryClient.InvalidProtocolSchema>

}



export declare namespace SpruceErrors.MercuryClient {

	
	export interface ConnectionFailed {
		
			
			'host': string
			
			'statusCode': number
	}

	export interface ConnectionFailedSchema extends SpruceSchema.Schema {
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

	export type ConnectionFailedEntity = SchemaEntity<SpruceErrors.MercuryClient.ConnectionFailedSchema>

}




