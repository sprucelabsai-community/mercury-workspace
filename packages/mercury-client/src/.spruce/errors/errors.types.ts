/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-redeclare */

import { default as SchemaEntity } from '@sprucelabs/schema'
import * as SpruceSchema from '@sprucelabs/schema'





export declare namespace SpruceErrors.MercuryClient {

	
	export interface UnexpectedPayload {
		
			
			'eventName': string
	}

	export interface UnexpectedPayloadSchema extends SpruceSchema.Schema {
		id: 'unexpectedPayload',
		namespace: 'MercuryClient',
		name: 'Unexpected payload',
		    fields: {
		            /** . */
		            'eventName': {
		                type: 'text',
		                isRequired: true,
		                options: undefined
		            },
		    }
	}

	export type UnexpectedPayloadEntity = SchemaEntity<SpruceErrors.MercuryClient.UnexpectedPayloadSchema>

}



export declare namespace SpruceErrors.MercuryClient {

	
	export interface NotConnected {
		
			
			'action': string
	}

	export interface NotConnectedSchema extends SpruceSchema.Schema {
		id: 'notConnected',
		namespace: 'MercuryClient',
		name: 'Not connected',
		    fields: {
		            /** . */
		            'action': {
		                type: 'text',
		                isRequired: true,
		                options: undefined
		            },
		    }
	}

	export type NotConnectedEntity = SchemaEntity<SpruceErrors.MercuryClient.NotConnectedSchema>

}



export declare namespace SpruceErrors.MercuryClient {

	
	export interface MissingTestCacheDir {
		
	}

	export interface MissingTestCacheDirSchema extends SpruceSchema.Schema {
		id: 'missingTestCacheDir',
		namespace: 'MercuryClient',
		name: 'Missing test cache dir',
		    fields: {
		    }
	}

	export type MissingTestCacheDirEntity = SchemaEntity<SpruceErrors.MercuryClient.MissingTestCacheDirSchema>

}



export declare namespace SpruceErrors.MercuryClient {

	
	export interface InvalidPayload {
		
			
			'eventName': string
	}

	export interface InvalidPayloadSchema extends SpruceSchema.Schema {
		id: 'invalidPayload',
		namespace: 'MercuryClient',
		name: 'Invalid payload',
		    fields: {
		            /** . */
		            'eventName': {
		                type: 'text',
		                isRequired: true,
		                options: undefined
		            },
		    }
	}

	export type InvalidPayloadEntity = SchemaEntity<SpruceErrors.MercuryClient.InvalidPayloadSchema>

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



export declare namespace SpruceErrors.MercuryClient {

	
	export interface Timeout {
		
			
			'eventName': string
			
			'timeoutMs': number
			
			'isConnected'?: boolean| undefined | null
	}

	export interface TimeoutSchema extends SpruceSchema.Schema {
		id: 'timeout',
		namespace: 'MercuryClient',
		name: 'Timeout',
		    fields: {
		            /** . */
		            'eventName': {
		                type: 'text',
		                isRequired: true,
		                options: undefined
		            },
		            /** . */
		            'timeoutMs': {
		                type: 'number',
		                isRequired: true,
		                options: undefined
		            },
		            /** . */
		            'isConnected': {
		                type: 'boolean',
		                options: undefined
		            },
		    }
	}

	export type TimeoutEntity = SchemaEntity<SpruceErrors.MercuryClient.TimeoutSchema>

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




