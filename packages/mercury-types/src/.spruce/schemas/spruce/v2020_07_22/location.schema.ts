import { SpruceSchemas } from '../../schemas.types'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'



const locationSchema: SpruceSchemas.Spruce.v2020_07_22.ILocationSchema  = {
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

export default locationSchema
