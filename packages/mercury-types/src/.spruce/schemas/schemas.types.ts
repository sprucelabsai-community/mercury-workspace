/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-redeclare */

import { default as SchemaEntity } from '@sprucelabs/schema'
export { SpruceSchemas } from '@sprucelabs/spruce-core-schemas/build/.spruce/schemas/core.schemas.types'

import * as SpruceSchema from '@sprucelabs/schema'


declare module '@sprucelabs/spruce-core-schemas/build/.spruce/schemas/core.schemas.types' {


	namespace SpruceSchemas.MercuryTypes.v2020_09_01 {

		
		interface IEventSignature {
			
				
				'eventNameWithOptionalNamespace': string
				
				'responsePayload'?: (SpruceSchema.ISchema)| undefined | null
				
				'emitPayload'?: (SpruceSchema.ISchema)| undefined | null
				
				'listenPermissionsAny'?: SpruceSchemas.MercuryTypes.v2020_09_01.IPermission[]| undefined | null
				
				'emitPermissionsAny'?: SpruceSchemas.MercuryTypes.v2020_09_01.IPermission[]| undefined | null
		}

		interface IEventSignatureSchema extends SpruceSchema.ISchema {
			id: 'eventSignature',
			name: 'Event Signature',
			    fields: {
			            /** . */
			            'eventNameWithOptionalNamespace': {
			                type: 'text',
			                isRequired: true,
			                options: undefined
			            },
			            /** . */
			            'responsePayload': {
			                type: 'raw',
			                options: {valueType: `SpruceSchema.ISchema`,}
			            },
			            /** . */
			            'emitPayload': {
			                type: 'raw',
			                options: {valueType: `SpruceSchema.ISchema`,}
			            },
			            /** . */
			            'listenPermissionsAny': {
			                type: 'schema',
			                isArray: true,
			                options: {schema: SpruceSchemas.MercuryTypes.v2020_09_01.IPermissionSchema,}
			            },
			            /** . */
			            'emitPermissionsAny': {
			                type: 'schema',
			                isArray: true,
			                options: {schema: SpruceSchemas.MercuryTypes.v2020_09_01.IPermissionSchema,}
			            },
			    }
		}

		type EventSignatureEntity = SchemaEntity<SpruceSchemas.MercuryTypes.v2020_09_01.IEventSignatureSchema>

	}


	namespace SpruceSchemas.MercuryTypes.v2020_09_01 {

		
		interface IMercuryContract {
			
				
				'eventSignatures': SpruceSchemas.MercuryTypes.v2020_09_01.IEventSignature[]
		}

		interface IMercuryContractSchema extends SpruceSchema.ISchema {
			id: 'mercuryContract',
			name: 'Mercury Contract',
			    fields: {
			            /** . */
			            'eventSignatures': {
			                type: 'schema',
			                isRequired: true,
			                isArray: true,
			                options: {schema: SpruceSchemas.MercuryTypes.v2020_09_01.IEventSignatureSchema,}
			            },
			    }
		}

		type MercuryContractEntity = SchemaEntity<SpruceSchemas.MercuryTypes.v2020_09_01.IMercuryContractSchema>

	}


	namespace SpruceSchemas.MercuryTypes.v2020_09_01 {

		
		interface IPermission {
			
				/** Permission name. Hyphen separated name for this permission, e.g. can-unlock-doors */
				'name': string
				/** Clocked in. Is the person clocked in and ready to rock? */
				'clockedIn'?: boolean| undefined | null
				/** Clocked out. When someone is not working (off the clock). */
				'clockedOut'?: boolean| undefined | null
				/** On premise. Are they at work (maybe working, maybe visiting). */
				'onPrem'?: boolean| undefined | null
				/** Off premise. They aren't at the office or shop. */
				'offPrem'?: boolean| undefined | null
		}

		interface IPermissionSchema extends SpruceSchema.ISchema {
			id: 'permission',
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

		type PermissionEntity = SchemaEntity<SpruceSchemas.MercuryTypes.v2020_09_01.IPermissionSchema>

	}


	namespace SpruceSchemas.MercuryTypes.v2020_09_01 {

		
		interface IPermissionContract {
			
				
				'permissions': SpruceSchemas.MercuryTypes.v2020_09_01.IPermission[]
		}

		interface IPermissionContractSchema extends SpruceSchema.ISchema {
			id: 'permissionContract',
			name: 'Permission Contract',
			    fields: {
			            /** . */
			            'permissions': {
			                type: 'schema',
			                isRequired: true,
			                isArray: true,
			                options: {schema: SpruceSchemas.MercuryTypes.v2020_09_01.IPermissionSchema,}
			            },
			    }
		}

		type PermissionContractEntity = SchemaEntity<SpruceSchemas.MercuryTypes.v2020_09_01.IPermissionContractSchema>

	}

}
