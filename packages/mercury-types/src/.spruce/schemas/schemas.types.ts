/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-redeclare */

import { default as SchemaEntity } from '@sprucelabs/schema'
import * as SpruceSchema from '@sprucelabs/schema'

import FieldType from '#spruce/schemas/fields/fieldTypeEnum'


export declare namespace SpruceSchemas.Spruce.v2020_07_22 {

	
	export interface IAcl {
			/** Permissions grouped by slug. */
			[slug:string]: string[]| undefined | null
	}

	export interface IAclSchema extends SpruceSchema.ISchema {
		id: 'acl',
		name: 'Access control list',
		dynamicFieldSignature: { 
		    label: 'Permissions grouped by slug',
		    type: FieldType.Text,
		    keyName: 'slug',
		    isArray: true,
		    options: undefined
		}	}

	export type AclEntity = SchemaEntity<SpruceSchemas.Spruce.v2020_07_22.IAclSchema>

}


export declare namespace SpruceSchemas.Spruce.v2020_07_22 {

	/** A physical location where people meet. An organization has at least one of them. */
	export interface ILocation {
		
			/** Id. */
			'id'?: string| undefined | null
			/** Name. */
			'name': string
			/** Store number. You can use other symbols, like # or dashes. #123 or 32-US-5 */
			'num'?: string| undefined | null
			/** Public. Is this location viewable by guests? */
			'isPublic'?: boolean| undefined | null
			/** Main Phone. */
			'phone'?: string| undefined | null
			/** Timezone. */
			'timezone'?: ("etc/gmt+12" | "pacific/midway" | "pacific/honolulu" | "us/alaska" | "america/los_Angeles" | "america/tijuana" | "us/arizona" | "america/chihuahua" | "us/mountain" | "america/managua" | "us/central" | "america/mexico_City" | "Canada/Saskatchewan" | "america/bogota" | "us/eastern" | "us/east-indiana" | "Canada/atlantic" | "america/caracas" | "america/manaus" | "america/Santiago" | "Canada/Newfoundland" | "america/Sao_Paulo" | "america/argentina/buenos_Aires" | "america/godthab" | "america/montevideo" | "america/Noronha" | "atlantic/cape_Verde" | "atlantic/azores" | "africa/casablanca" | "etc/gmt" | "europe/amsterdam" | "europe/belgrade" | "europe/brussels" | "europe/Sarajevo" | "africa/lagos" | "asia/amman" | "europe/athens" | "asia/beirut" | "africa/cairo" | "africa/Harare" | "europe/Helsinki" | "asia/Jerusalem" | "europe/minsk" | "africa/Windhoek" | "asia/Kuwait" | "europe/moscow" | "africa/Nairobi" | "asia/tbilisi" | "asia/tehran" | "asia/muscat" | "asia/baku" | "asia/Yerevan" | "asia/Kabul" | "asia/Yekaterinburg" | "asia/Karachi" | "asia/calcutta" | "asia/calcutta" | "asia/Katmandu" | "asia/almaty" | "asia/Dhaka" | "asia/Rangoon" | "asia/bangkok" | "asia/Krasnoyarsk" | "asia/Hong_Kong" | "asia/Kuala_Lumpur" | "asia/Irkutsk" | "Australia/Perth" | "asia/taipei" | "asia/tokyo" | "asia/Seoul" | "asia/Yakutsk" | "Australia/adelaide" | "Australia/Darwin" | "Australia/brisbane" | "Australia/canberra" | "Australia/Hobart" | "pacific/guam" | "asia/Vladivostok" | "asia/magadan" | "pacific/auckland" | "pacific/Fiji" | "pacific/tongatapu")| undefined | null
			/** Address. */
			'address': SpruceSchema.IAddressFieldValue
	}

	export interface ILocationSchema extends SpruceSchema.ISchema {
		id: 'location',
		name: 'Location',
		description: 'A physical location where people meet. An organization has at least one of them.',
		    fields: {
		            /** Id. */
		            'id': {
		                label: 'Id',
		                type: FieldType.Id,
		                options: undefined
		            },
		            /** Name. */
		            'name': {
		                label: 'Name',
		                type: FieldType.Text,
		                isRequired: true,
		                options: undefined
		            },
		            /** Store number. You can use other symbols, like # or dashes. #123 or 32-US-5 */
		            'num': {
		                label: 'Store number',
		                type: FieldType.Text,
		                hint: 'You can use other symbols, like # or dashes. #123 or 32-US-5',
		                options: undefined
		            },
		            /** Public. Is this location viewable by guests? */
		            'isPublic': {
		                label: 'Public',
		                type: FieldType.Boolean,
		                hint: 'Is this location viewable by guests?',
		                defaultValue: false,
		                options: undefined
		            },
		            /** Main Phone. */
		            'phone': {
		                label: 'Main Phone',
		                type: FieldType.Phone,
		                options: undefined
		            },
		            /** Timezone. */
		            'timezone': {
		                label: 'Timezone',
		                type: FieldType.Select,
		                options: {choices: [{"value":"etc/gmt+12","label":"International Date Line West"},{"value":"pacific/midway","label":"Midway Island, Samoa"},{"value":"pacific/honolulu","label":"Hawaii"},{"value":"us/alaska","label":"Alaska"},{"value":"america/los_Angeles","label":"Pacific Time (US & Canada)"},{"value":"america/tijuana","label":"Tijuana, Baja California"},{"value":"us/arizona","label":"Arizona"},{"value":"america/chihuahua","label":"Chihuahua, La Paz, Mazatlan"},{"value":"us/mountain","label":"Mountain Time (US & Canada)"},{"value":"america/managua","label":"Central America"},{"value":"us/central","label":"Central Time (US & Canada)"},{"value":"america/mexico_City","label":"Guadalajara, Mexico City, Monterrey"},{"value":"Canada/Saskatchewan","label":"Saskatchewan"},{"value":"america/bogota","label":"Bogota, Lima, Quito, Rio Branco"},{"value":"us/eastern","label":"Eastern Time (US & Canada)"},{"value":"us/east-indiana","label":"Indiana (East)"},{"value":"Canada/atlantic","label":"Atlantic Time (Canada)"},{"value":"america/caracas","label":"Caracas, La Paz"},{"value":"america/manaus","label":"Manaus"},{"value":"america/Santiago","label":"Santiago"},{"value":"Canada/Newfoundland","label":"Newfoundland"},{"value":"america/Sao_Paulo","label":"Brasilia"},{"value":"america/argentina/buenos_Aires","label":"Buenos Aires, Georgetown"},{"value":"america/godthab","label":"Greenland"},{"value":"america/montevideo","label":"Montevideo"},{"value":"america/Noronha","label":"Mid-Atlantic"},{"value":"atlantic/cape_Verde","label":"Cape Verde Is."},{"value":"atlantic/azores","label":"Azores"},{"value":"africa/casablanca","label":"Casablanca, Monrovia, Reykjavik"},{"value":"etc/gmt","label":"Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London"},{"value":"europe/amsterdam","label":"Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna"},{"value":"europe/belgrade","label":"Belgrade, Bratislava, Budapest, Ljubljana, Prague"},{"value":"europe/brussels","label":"Brussels, Copenhagen, Madrid, Paris"},{"value":"europe/Sarajevo","label":"Sarajevo, Skopje, Warsaw, Zagreb"},{"value":"africa/lagos","label":"West Central Africa"},{"value":"asia/amman","label":"Amman"},{"value":"europe/athens","label":"Athens, Bucharest, Istanbul"},{"value":"asia/beirut","label":"Beirut"},{"value":"africa/cairo","label":"Cairo"},{"value":"africa/Harare","label":"Harare, Pretoria"},{"value":"europe/Helsinki","label":"Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius"},{"value":"asia/Jerusalem","label":"Jerusalem"},{"value":"europe/minsk","label":"Minsk"},{"value":"africa/Windhoek","label":"Windhoek"},{"value":"asia/Kuwait","label":"Kuwait, Riyadh, Baghdad"},{"value":"europe/moscow","label":"Moscow, St. Petersburg, Volgograd"},{"value":"africa/Nairobi","label":"Nairobi"},{"value":"asia/tbilisi","label":"Tbilisi"},{"value":"asia/tehran","label":"Tehran"},{"value":"asia/muscat","label":"Abu Dhabi, Muscat"},{"value":"asia/baku","label":"Baku"},{"value":"asia/Yerevan","label":"Yerevan"},{"value":"asia/Kabul","label":"Kabul"},{"value":"asia/Yekaterinburg","label":"Yekaterinburg"},{"value":"asia/Karachi","label":"Islamabad, Karachi, Tashkent"},{"value":"asia/calcutta","label":"Chennai, Kolkata, Mumbai, New Delhi"},{"value":"asia/calcutta","label":"Sri Jayawardenapura"},{"value":"asia/Katmandu","label":"Kathmandu"},{"value":"asia/almaty","label":"Almaty, Novosibirsk"},{"value":"asia/Dhaka","label":"Astana, Dhaka"},{"value":"asia/Rangoon","label":"Yangon (Rangoon)"},{"value":"asia/bangkok","label":"Bangkok, Hanoi, Jakarta"},{"value":"asia/Krasnoyarsk","label":"Krasnoyarsk"},{"value":"asia/Hong_Kong","label":"Beijing, Chongqing, Hong Kong, Urumqi"},{"value":"asia/Kuala_Lumpur","label":"Kuala Lumpur, Singapore"},{"value":"asia/Irkutsk","label":"Irkutsk, Ulaan Bataar"},{"value":"Australia/Perth","label":"Perth"},{"value":"asia/taipei","label":"Taipei"},{"value":"asia/tokyo","label":"Osaka, Sapporo, Tokyo"},{"value":"asia/Seoul","label":"Seoul"},{"value":"asia/Yakutsk","label":"Yakutsk"},{"value":"Australia/adelaide","label":"Adelaide"},{"value":"Australia/Darwin","label":"Darwin"},{"value":"Australia/brisbane","label":"Brisbane"},{"value":"Australia/canberra","label":"Canberra, Melbourne, Sydney"},{"value":"Australia/Hobart","label":"Hobart"},{"value":"pacific/guam","label":"Guam, Port Moresby"},{"value":"asia/Vladivostok","label":"Vladivostok"},{"value":"asia/magadan","label":"Magadan, Solomon Is., New Caledonia"},{"value":"pacific/auckland","label":"Auckland, Wellington"},{"value":"pacific/Fiji","label":"Fiji, Kamchatka, Marshall Is."},{"value":"pacific/tongatapu","label":"Nuku'alofa"}],}
		            },
		            /** Address. */
		            'address': {
		                label: 'Address',
		                type: FieldType.Address,
		                isRequired: true,
		                options: undefined
		            },
		    }
	}

	export type LocationEntity = SchemaEntity<SpruceSchemas.Spruce.v2020_07_22.ILocationSchema>

}


export declare namespace SpruceSchemas.Spruce.v2020_07_22 {

	/** A position at a company. The answer to the question; What is your job? */
	export interface IJob {
		
			/** Id. */
			'id'?: string| undefined | null
			/** Is default. Is this job one that comes with every org? Mapped to roles (owner, groupManager, manager, guest). */
			'isDefault': string
			/** Name. */
			'name': string
			/** Role. */
			'role': ("owner" | "groupManager" | "manager" | "teammate" | "guest")
			/** On work permissions. */
			'inStoreAcls'?: SpruceSchemas.Spruce.v2020_07_22.IAcl| undefined | null
			/** Off work permissions. */
			'acls'?: SpruceSchemas.Spruce.v2020_07_22.IAcl| undefined | null
	}

	export interface IJobSchema extends SpruceSchema.ISchema {
		id: 'job',
		name: 'Job',
		description: 'A position at a company. The answer to the question; What is your job?',
		    fields: {
		            /** Id. */
		            'id': {
		                label: 'Id',
		                type: FieldType.Id,
		                options: undefined
		            },
		            /** Is default. Is this job one that comes with every org? Mapped to roles (owner, groupManager, manager, guest). */
		            'isDefault': {
		                label: 'Is default',
		                type: FieldType.Text,
		                isRequired: true,
		                hint: 'Is this job one that comes with every org? Mapped to roles (owner, groupManager, manager, guest).',
		                options: undefined
		            },
		            /** Name. */
		            'name': {
		                label: 'Name',
		                type: FieldType.Text,
		                isRequired: true,
		                options: undefined
		            },
		            /** Role. */
		            'role': {
		                label: 'Role',
		                type: FieldType.Select,
		                isRequired: true,
		                options: {choices: [{"value":"owner","label":"Owner"},{"value":"groupManager","label":"District/region manager"},{"value":"manager","label":"Manager"},{"value":"teammate","label":"Teammate"},{"value":"guest","label":"Guest"}],}
		            },
		            /** On work permissions. */
		            'inStoreAcls': {
		                label: 'On work permissions',
		                type: FieldType.Schema,
		                options: {schema: SpruceSchemas.Spruce.v2020_07_22.IAclSchema,}
		            },
		            /** Off work permissions. */
		            'acls': {
		                label: 'Off work permissions',
		                type: FieldType.Schema,
		                options: {schema: SpruceSchemas.Spruce.v2020_07_22.IAclSchema,}
		            },
		    }
	}

	export type JobEntity = SchemaEntity<SpruceSchemas.Spruce.v2020_07_22.IJobSchema>

}


export declare namespace SpruceSchemas.Spruce.v2020_07_22 {

	/** A human being. */
	export interface IPerson {
		
			/** Id. */
			'id': string
			/** First name. */
			'firstName'?: string| undefined | null
			/** Last name. */
			'lastName'?: string| undefined | null
			/** Casual name. The name you can use when talking to this person. */
			'casualName': string
			/** Phone. A number that can be texted */
			'phone'?: string| undefined | null
			/** Profile photos. */
			'profileImages'?: SpruceSchemas.Spruce.v2020_07_22.IProfileImage| undefined | null
	}

	export interface IPersonSchema extends SpruceSchema.ISchema {
		id: 'person',
		name: 'Person',
		description: 'A human being.',
		    fields: {
		            /** Id. */
		            'id': {
		                label: 'Id',
		                type: FieldType.Id,
		                isRequired: true,
		                options: undefined
		            },
		            /** First name. */
		            'firstName': {
		                label: 'First name',
		                type: FieldType.Text,
		                isPrivate: true,
		                options: undefined
		            },
		            /** Last name. */
		            'lastName': {
		                label: 'Last name',
		                type: FieldType.Text,
		                isPrivate: true,
		                options: undefined
		            },
		            /** Casual name. The name you can use when talking to this person. */
		            'casualName': {
		                label: 'Casual name',
		                type: FieldType.Text,
		                isRequired: true,
		                hint: 'The name you can use when talking to this person.',
		                options: undefined
		            },
		            /** Phone. A number that can be texted */
		            'phone': {
		                label: 'Phone',
		                type: FieldType.Phone,
		                isPrivate: true,
		                hint: 'A number that can be texted',
		                options: undefined
		            },
		            /** Profile photos. */
		            'profileImages': {
		                label: 'Profile photos',
		                type: FieldType.Schema,
		                options: {schema: SpruceSchemas.Spruce.v2020_07_22.IProfileImageSchema,}
		            },
		    }
	}

	export type PersonEntity = SchemaEntity<SpruceSchemas.Spruce.v2020_07_22.IPersonSchema>

}


export declare namespace SpruceSchemas.Spruce.v2020_07_22 {

	/** A person&#x27;s visit to a location (business or home). */
	export interface IPersonLocation {
		
			/** Id. */
			'id'?: string| undefined | null
			/** Name. */
			'roles': ("owner" | "groupManager" | "manager" | "teammate" | "guest")
			/** Status. */
			'status'?: string| undefined | null
			/** Total visits. */
			'visits': number
			/** Last visit. */
			'lastRecordedVisit'?: SpruceSchema.IDateTimeFieldValue| undefined | null
			/** Job. */
			'job': SpruceSchemas.Spruce.v2020_07_22.IJob
			/** Location. */
			'location': SpruceSchemas.Spruce.v2020_07_22.ILocation
			/** Person. */
			'person': SpruceSchemas.Spruce.v2020_07_22.IPerson
	}

	export interface IPersonLocationSchema extends SpruceSchema.ISchema {
		id: 'personLocation',
		name: 'Person location',
		description: 'A person\'s visit to a location (business or home).',
		    fields: {
		            /** Id. */
		            'id': {
		                label: 'Id',
		                type: FieldType.Id,
		                options: undefined
		            },
		            /** Name. */
		            'roles': {
		                label: 'Name',
		                type: FieldType.Select,
		                isRequired: true,
		                isArray: true,
		                options: {choices: [{"value":"owner","label":"Owner"},{"value":"groupManager","label":"District/region manager"},{"value":"manager","label":"Manager"},{"value":"teammate","label":"Teammate"},{"value":"guest","label":"Guest"}],}
		            },
		            /** Status. */
		            'status': {
		                label: 'Status',
		                type: FieldType.Text,
		                options: undefined
		            },
		            /** Total visits. */
		            'visits': {
		                label: 'Total visits',
		                type: FieldType.Number,
		                isRequired: true,
		                options: {choices: [{"value":"owner","label":"Owner"},{"value":"groupManager","label":"District/region manager"},{"value":"manager","label":"Manager"},{"value":"teammate","label":"Teammate"},{"value":"guest","label":"Guest"}],}
		            },
		            /** Last visit. */
		            'lastRecordedVisit': {
		                label: 'Last visit',
		                type: FieldType.DateTime,
		                options: undefined
		            },
		            /** Job. */
		            'job': {
		                label: 'Job',
		                type: FieldType.Schema,
		                isRequired: true,
		                options: {schema: SpruceSchemas.Spruce.v2020_07_22.IJobSchema,}
		            },
		            /** Location. */
		            'location': {
		                label: 'Location',
		                type: FieldType.Schema,
		                isRequired: true,
		                options: {schema: SpruceSchemas.Spruce.v2020_07_22.ILocationSchema,}
		            },
		            /** Person. */
		            'person': {
		                label: 'Person',
		                type: FieldType.Schema,
		                isRequired: true,
		                options: {schema: SpruceSchemas.Spruce.v2020_07_22.IPersonSchema,}
		            },
		    }
	}

	export type PersonLocationEntity = SchemaEntity<SpruceSchemas.Spruce.v2020_07_22.IPersonLocationSchema>

}


export declare namespace SpruceSchemas.Spruce.v2020_07_22 {

	/** Various sizes that a profile image comes in. */
	export interface IProfileImage {
		
			/** 60x60. */
			'profile60': string
			/** 150x150. */
			'profile150': string
			/** 60x60. */
			'profile60@2x': string
			/** 150x150. */
			'profile150@2x': string
	}

	export interface IProfileImageSchema extends SpruceSchema.ISchema {
		id: 'profileImage',
		name: 'Profile Image Sizes',
		description: 'Various sizes that a profile image comes in.',
		    fields: {
		            /** 60x60. */
		            'profile60': {
		                label: '60x60',
		                type: FieldType.Text,
		                isRequired: true,
		                options: undefined
		            },
		            /** 150x150. */
		            'profile150': {
		                label: '150x150',
		                type: FieldType.Text,
		                isRequired: true,
		                options: undefined
		            },
		            /** 60x60. */
		            'profile60@2x': {
		                label: '60x60',
		                type: FieldType.Text,
		                isRequired: true,
		                options: undefined
		            },
		            /** 150x150. */
		            'profile150@2x': {
		                label: '150x150',
		                type: FieldType.Text,
		                isRequired: true,
		                options: undefined
		            },
		    }
	}

	export type ProfileImageEntity = SchemaEntity<SpruceSchemas.Spruce.v2020_07_22.IProfileImageSchema>

}


export declare namespace SpruceSchemas.Spruce.v2020_07_22 {

	
	export interface ISkillCreator {
		
			
			'skillId'?: string| undefined | null
			
			'personId'?: string| undefined | null
	}

	export interface ISkillCreatorSchema extends SpruceSchema.ISchema {
		id: 'skillCreator',
		name: 'Skill creator',
		    fields: {
		            /** . */
		            'skillId': {
		                type: FieldType.Text,
		                options: undefined
		            },
		            /** . */
		            'personId': {
		                type: FieldType.Text,
		                options: undefined
		            },
		    }
	}

	export type SkillCreatorEntity = SchemaEntity<SpruceSchemas.Spruce.v2020_07_22.ISkillCreatorSchema>

}


export declare namespace SpruceSchemas.Spruce.v2020_07_22 {

	/** An ability Sprucebot has learned. */
	export interface ISkill {
		
			/** Id. */
			'id': string
			/** Id. */
			'apiKey': string
			/** Name. */
			'name': string
			/** Description. */
			'description'?: string| undefined | null
			/** Slug. */
			'slug': string
			/** Creators. The people or skills who created and own this skill. */
			'creators': SpruceSchemas.Spruce.v2020_07_22.ISkillCreator[]
	}

	export interface ISkillSchema extends SpruceSchema.ISchema {
		id: 'skill',
		name: 'Skill',
		description: 'An ability Sprucebot has learned.',
		    fields: {
		            /** Id. */
		            'id': {
		                label: 'Id',
		                type: FieldType.Id,
		                isRequired: true,
		                options: undefined
		            },
		            /** Id. */
		            'apiKey': {
		                label: 'Id',
		                type: FieldType.Id,
		                isPrivate: true,
		                isRequired: true,
		                options: undefined
		            },
		            /** Name. */
		            'name': {
		                label: 'Name',
		                type: FieldType.Text,
		                isRequired: true,
		                options: undefined
		            },
		            /** Description. */
		            'description': {
		                label: 'Description',
		                type: FieldType.Text,
		                options: undefined
		            },
		            /** Slug. */
		            'slug': {
		                label: 'Slug',
		                type: FieldType.Text,
		                isRequired: true,
		                options: undefined
		            },
		            /** Creators. The people or skills who created and own this skill. */
		            'creators': {
		                label: 'Creators',
		                type: FieldType.Schema,
		                isPrivate: true,
		                isRequired: true,
		                hint: 'The people or skills who created and own this skill.',
		                isArray: true,
		                options: {schema: SpruceSchemas.Spruce.v2020_07_22.ISkillCreatorSchema,}
		            },
		    }
	}

	export type SkillEntity = SchemaEntity<SpruceSchemas.Spruce.v2020_07_22.ISkillSchema>

}


export declare namespace SpruceSchemas.Local.v2020_09_01 {

	
	export interface IEventSignature {
		
			
			'responsePayload'?: (SpruceSchema.ISchema)| undefined | null
			
			'emitPayload'?: (SpruceSchema.ISchema)| undefined | null
			
			'listenPermissionsAny'?: SpruceSchemas.Local.v2020_09_01.IPermissionContract| undefined | null
			
			'emitPermissionsAny'?: SpruceSchemas.Local.v2020_09_01.IPermissionContract| undefined | null
	}

	export interface IEventSignatureSchema extends SpruceSchema.ISchema {
		id: 'eventSignature',
		name: 'Event Signature',
		    fields: {
		            /** . */
		            'responsePayload': {
		                type: FieldType.Raw,
		                options: {valueType: `SpruceSchema.ISchema`,}
		            },
		            /** . */
		            'emitPayload': {
		                type: FieldType.Raw,
		                options: {valueType: `SpruceSchema.ISchema`,}
		            },
		            /** . */
		            'listenPermissionsAny': {
		                type: FieldType.Schema,
		                options: {schema: SpruceSchemas.Local.v2020_09_01.IPermissionContractSchema,}
		            },
		            /** . */
		            'emitPermissionsAny': {
		                type: FieldType.Schema,
		                options: {schema: SpruceSchemas.Local.v2020_09_01.IPermissionContractSchema,}
		            },
		    }
	}

	export type EventSignatureEntity = SchemaEntity<SpruceSchemas.Local.v2020_09_01.IEventSignatureSchema>

}


export declare namespace SpruceSchemas.Local.v2020_09_01 {

	
	export interface IMercuryContract {
			/** . */
			[eventNameWithOptionalNamespace:string]: SpruceSchemas.Local.v2020_09_01.IEventSignature| undefined | null
	}

	export interface IMercuryContractSchema extends SpruceSchema.ISchema {
		id: 'mercuryContract',
		name: 'Mercury Contract',
		dynamicFieldSignature: { 
		    type: FieldType.Schema,
		    keyName: 'eventNameWithOptionalNamespace',
		    options: {schema: SpruceSchemas.Local.v2020_09_01.IEventSignatureSchema,}
		}	}

	export type MercuryContractEntity = SchemaEntity<SpruceSchemas.Local.v2020_09_01.IMercuryContractSchema>

}


export declare namespace SpruceSchemas.Local.v2020_09_01 {

	
	export interface IPermissionContract {
		
			/** Clocked in. Is the person clocked in and ready to rock? */
			'clockedIn'?: boolean| undefined | null
			/** Clocked out. When someone is not working (off the clock). */
			'clockedOut'?: boolean| undefined | null
			/** On premise. Are they at work (maybe working, maybe visiting). */
			'onPrem'?: boolean| undefined | null
			/** Off premise. They aren't at the office or shop. */
			'offPrem'?: boolean| undefined | null
	}

	export interface IPermissionContractSchema extends SpruceSchema.ISchema {
		id: 'permissionContract',
		name: 'Permission Contract',
		    fields: {
		            /** Clocked in. Is the person clocked in and ready to rock? */
		            'clockedIn': {
		                label: 'Clocked in',
		                type: FieldType.Boolean,
		                hint: 'Is the person clocked in and ready to rock?',
		                options: undefined
		            },
		            /** Clocked out. When someone is not working (off the clock). */
		            'clockedOut': {
		                label: 'Clocked out',
		                type: FieldType.Boolean,
		                hint: 'When someone is not working (off the clock).',
		                options: undefined
		            },
		            /** On premise. Are they at work (maybe working, maybe visiting). */
		            'onPrem': {
		                label: 'On premise',
		                type: FieldType.Boolean,
		                hint: 'Are they at work (maybe working, maybe visiting).',
		                options: undefined
		            },
		            /** Off premise. They aren't at the office or shop. */
		            'offPrem': {
		                label: 'Off premise',
		                type: FieldType.Boolean,
		                hint: 'They aren\'t at the office or shop.',
		                options: undefined
		            },
		    }
	}

	export type PermissionContractEntity = SchemaEntity<SpruceSchemas.Local.v2020_09_01.IPermissionContractSchema>

}




