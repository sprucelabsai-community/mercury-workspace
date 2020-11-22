/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-redeclare */

export { SpruceSchemas } from '@sprucelabs/spruce-core-schemas/build/.spruce/schemas/core.schemas.types'

import { default as SchemaEntity } from '@sprucelabs/schema'



import * as SpruceSchema from '@sprucelabs/schema'


declare module '@sprucelabs/spruce-core-schemas/build/.spruce/schemas/core.schemas.types' {


	namespace SpruceSchemas.MercuryTypes.v2020_09_01 {

		
		interface IPermission {
			
				/** id. Hyphen separated di for this permission, e.g. can-unlock-doors */
				'id': string
				/** Name. Human readable name for this permission */
				'name': string
				/** Description. */
				'description'?: string| undefined | null
				/** Require all statuses. */
				'requireAllStatuses'?: boolean| undefined | null
				
				'defaultsByRoleBase'?: SpruceSchemas.MercuryTypes.v2020_09_01.IDefaultsByRole| undefined | null
				
				'can'?: SpruceSchemas.MercuryTypes.v2020_09_01.IStatusFlags| undefined | null
		}

		interface IPermissionSchema extends SpruceSchema.ISchema {
			id: 'permission',
			version: 'v2020_09_01',
			namespace: 'MercuryTypes',
			name: 'Permission',
			    fields: {
			            /** id. Hyphen separated di for this permission, e.g. can-unlock-doors */
			            'id': {
			                label: 'id',
			                type: 'text',
			                isRequired: true,
			                hint: 'Hyphen separated di for this permission, e.g. can-unlock-doors',
			                options: undefined
			            },
			            /** Name. Human readable name for this permission */
			            'name': {
			                label: 'Name',
			                type: 'text',
			                isRequired: true,
			                hint: 'Human readable name for this permission',
			                options: undefined
			            },
			            /** Description. */
			            'description': {
			                label: 'Description',
			                type: 'text',
			                options: undefined
			            },
			            /** Require all statuses. */
			            'requireAllStatuses': {
			                label: 'Require all statuses',
			                type: 'boolean',
			                defaultValue: false,
			                options: undefined
			            },
			            /** . */
			            'defaultsByRoleBase': {
			                type: 'schema',
			                options: {schema: SpruceSchemas.MercuryTypes.v2020_09_01.IDefaultsByRoleSchema,}
			            },
			            /** . */
			            'can': {
			                type: 'schema',
			                options: {schema: SpruceSchemas.MercuryTypes.v2020_09_01.IStatusFlagsSchema,}
			            },
			    }
		}

		type PermissionEntity = SchemaEntity<SpruceSchemas.MercuryTypes.v2020_09_01.IPermissionSchema>

	}


	namespace SpruceSchemas.MercuryTypes.v2020_09_01 {

		
		interface IPermissionContract {
			
				
				'id': string
				/** Name. Human readable name for this contract */
				'name': string
				/** Description. */
				'description'?: string| undefined | null
				/** Require all permissions. */
				'requireAllPermissions'?: boolean| undefined | null
				
				'permissions': SpruceSchemas.MercuryTypes.v2020_09_01.IPermission[]
		}

		interface IPermissionContractSchema extends SpruceSchema.ISchema {
			id: 'permissionContract',
			version: 'v2020_09_01',
			namespace: 'MercuryTypes',
			name: 'Permission contract',
			    fields: {
			            /** . */
			            'id': {
			                type: 'text',
			                isRequired: true,
			                options: undefined
			            },
			            /** Name. Human readable name for this contract */
			            'name': {
			                label: 'Name',
			                type: 'text',
			                isRequired: true,
			                hint: 'Human readable name for this contract',
			                options: undefined
			            },
			            /** Description. */
			            'description': {
			                label: 'Description',
			                type: 'text',
			                options: undefined
			            },
			            /** Require all permissions. */
			            'requireAllPermissions': {
			                label: 'Require all permissions',
			                type: 'boolean',
			                defaultValue: false,
			                options: undefined
			            },
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


	namespace SpruceSchemas.MercuryTypes.v2020_09_01 {

		
		interface IEventSignature {
			
				
				'responsePayloadSchema'?: (SpruceSchema.ISchema)| undefined | null
				
				'emitPayloadSchema'?: (SpruceSchema.ISchema)| undefined | null
				
				'listenPermissionContract'?: SpruceSchemas.MercuryTypes.v2020_09_01.IPermissionContract| undefined | null
				
				'emitPermissionContract'?: SpruceSchemas.MercuryTypes.v2020_09_01.IPermissionContract| undefined | null
		}

		interface IEventSignatureSchema extends SpruceSchema.ISchema {
			id: 'eventSignature',
			version: 'v2020_09_01',
			namespace: 'MercuryTypes',
			name: 'Event Signature',
			    fields: {
			            /** . */
			            'responsePayloadSchema': {
			                type: 'raw',
			                options: {valueType: `SpruceSchema.ISchema`,}
			            },
			            /** . */
			            'emitPayloadSchema': {
			                type: 'raw',
			                options: {valueType: `SpruceSchema.ISchema`,}
			            },
			            /** . */
			            'listenPermissionContract': {
			                type: 'schema',
			                options: {schema: SpruceSchemas.MercuryTypes.v2020_09_01.IPermissionContractSchema,}
			            },
			            /** . */
			            'emitPermissionContract': {
			                type: 'schema',
			                options: {schema: SpruceSchemas.MercuryTypes.v2020_09_01.IPermissionContractSchema,}
			            },
			    }
		}

		type EventSignatureEntity = SchemaEntity<SpruceSchemas.MercuryTypes.v2020_09_01.IEventSignatureSchema>

	}


	namespace SpruceSchemas.MercuryTypes.v2020_09_01 {

		
		interface IEventSignaturesByName {
				/** . */
				[eventName:string]: SpruceSchemas.MercuryTypes.v2020_09_01.IEventSignature
		}

		interface IEventSignaturesByNameSchema extends SpruceSchema.ISchema {
			id: 'eventSignaturesByName',
			version: 'v2020_09_01',
			namespace: 'MercuryTypes',
			name: '',
			dynamicFieldSignature: { 
			    type: 'schema',
			    keyName: 'eventName',
			    isRequired: true,
			    options: {schema: SpruceSchemas.MercuryTypes.v2020_09_01.IEventSignatureSchema,}
			}		}

		type EventSignaturesByNameEntity = SchemaEntity<SpruceSchemas.MercuryTypes.v2020_09_01.IEventSignaturesByNameSchema>

	}


	namespace SpruceSchemas.MercuryTypes.v2020_09_01 {

		
		interface IEventContract {
			
				
				'eventSignatures': SpruceSchemas.MercuryTypes.v2020_09_01.IEventSignaturesByName
		}

		interface IEventContractSchema extends SpruceSchema.ISchema {
			id: 'eventContract',
			version: 'v2020_09_01',
			namespace: 'MercuryTypes',
			name: 'Event contract',
			    fields: {
			            /** . */
			            'eventSignatures': {
			                type: 'schema',
			                isRequired: true,
			                options: {schema: SpruceSchemas.MercuryTypes.v2020_09_01.IEventSignaturesByNameSchema,}
			            },
			    }
		}

		type EventContractEntity = SchemaEntity<SpruceSchemas.MercuryTypes.v2020_09_01.IEventContractSchema>

	}


	namespace SpruceSchemas.MercuryTypes.v2020_09_01 {

		
		interface IStatusFlags {
			
				/** . What is the fallback if no status is set? */
				'default'?: boolean| undefined | null
				/** Clocked in. Is the person clocked in and ready to rock? */
				'clockedIn'?: boolean| undefined | null
				/** Clocked out. When someone is not working (off the clock). */
				'clockedOut'?: boolean| undefined | null
				/** On premise. Are they at work (maybe working, maybe visiting). */
				'onPrem'?: boolean| undefined | null
				/** Off premise. They aren't at the office or shop. */
				'offPrem'?: boolean| undefined | null
		}

		interface IStatusFlagsSchema extends SpruceSchema.ISchema {
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

		type StatusFlagsEntity = SchemaEntity<SpruceSchemas.MercuryTypes.v2020_09_01.IStatusFlagsSchema>

	}


	namespace SpruceSchemas.MercuryTypes.v2020_09_01 {

		
		interface IDefaultsByRole {
			
				/** Owner. */
				'owner'?: SpruceSchemas.MercuryTypes.v2020_09_01.IStatusFlags| undefined | null
				/** Group manager. */
				'groupManager'?: SpruceSchemas.MercuryTypes.v2020_09_01.IStatusFlags| undefined | null
				/** Manager. */
				'manager'?: SpruceSchemas.MercuryTypes.v2020_09_01.IStatusFlags| undefined | null
				/** Teammate. */
				'teammate'?: SpruceSchemas.MercuryTypes.v2020_09_01.IStatusFlags| undefined | null
				/** Guest. */
				'guest'?: SpruceSchemas.MercuryTypes.v2020_09_01.IStatusFlags| undefined | null
				/** Anonymous. */
				'anonymous'?: SpruceSchemas.MercuryTypes.v2020_09_01.IStatusFlags| undefined | null
		}

		interface IDefaultsByRoleSchema extends SpruceSchema.ISchema {
			id: 'defaultsByRole',
			version: 'v2020_09_01',
			namespace: 'MercuryTypes',
			name: '',
			    fields: {
			            /** Owner. */
			            'owner': {
			                label: 'Owner',
			                type: 'schema',
			                options: {schema: SpruceSchemas.MercuryTypes.v2020_09_01.IStatusFlagsSchema,}
			            },
			            /** Group manager. */
			            'groupManager': {
			                label: 'Group manager',
			                type: 'schema',
			                options: {schema: SpruceSchemas.MercuryTypes.v2020_09_01.IStatusFlagsSchema,}
			            },
			            /** Manager. */
			            'manager': {
			                label: 'Manager',
			                type: 'schema',
			                options: {schema: SpruceSchemas.MercuryTypes.v2020_09_01.IStatusFlagsSchema,}
			            },
			            /** Teammate. */
			            'teammate': {
			                label: 'Teammate',
			                type: 'schema',
			                options: {schema: SpruceSchemas.MercuryTypes.v2020_09_01.IStatusFlagsSchema,}
			            },
			            /** Guest. */
			            'guest': {
			                label: 'Guest',
			                type: 'schema',
			                options: {schema: SpruceSchemas.MercuryTypes.v2020_09_01.IStatusFlagsSchema,}
			            },
			            /** Anonymous. */
			            'anonymous': {
			                label: 'Anonymous',
			                type: 'schema',
			                options: {schema: SpruceSchemas.MercuryTypes.v2020_09_01.IStatusFlagsSchema,}
			            },
			    }
		}

		type DefaultsByRoleEntity = SchemaEntity<SpruceSchemas.MercuryTypes.v2020_09_01.IDefaultsByRoleSchema>

	}

}
