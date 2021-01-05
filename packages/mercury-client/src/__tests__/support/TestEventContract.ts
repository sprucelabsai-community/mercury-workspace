import { buildEventContract } from '@sprucelabs/mercury-types'
import { buildSchema } from '@sprucelabs/schema'

export const testEventContract = buildEventContract({
	eventSignatures: {
		'authenticate::v2020_12_25': {
			emitPayloadSchema: {
				id: 'authenticateTargetAndPayload',
				fields: {
					payload: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'authenticateEmitPayload',
								fields: {
									token: { type: 'text', isRequired: false },
									skillId: { type: 'text', isRequired: false },
									apiKey: { type: 'text', isRequired: false },
								},
							},
						},
					},
				},
			},
			responsePayloadSchema: {
				id: 'authenticateResponsePayload',
				fields: {
					type: {
						type: 'select',
						isRequired: true,
						options: {
							choices: [
								{ value: 'authenticated', label: 'Authenticated' },
								{ value: 'anonymous', label: 'Anonymous' },
							],
						},
					},
					auth: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'authSchema',
								fields: {
									person: {
										type: 'schema',
										options: {
											schema: {
												id: 'person',
												version: 'v2020_07_22',
												namespace: 'Spruce',
												name: 'Person',
												description: 'A human being.',
												fields: {
													id: { label: 'Id', type: 'id', isRequired: true },
													firstName: {
														label: 'First name',
														type: 'text',
														isPrivate: true,
													},
													lastName: {
														label: 'Last name',
														type: 'text',
														isPrivate: true,
													},
													casualName: {
														label: 'Casual name',
														type: 'text',
														isRequired: true,
														hint:
															'The name you can use when talking to this person.',
													},
													phone: {
														label: 'Phone',
														type: 'phone',
														isPrivate: true,
														hint: 'A number that can be texted',
													},
													profileImages: {
														label: 'Profile photos',
														type: 'schema',
														options: {
															schema: {
																id: 'profileImage',
																version: 'v2020_07_22',
																namespace: 'Spruce',
																name: 'Profile Image Sizes',
																description:
																	'Various sizes that a profile image comes in.',
																fields: {
																	profile60: {
																		label: '60x60',
																		type: 'text',
																		isRequired: true,
																	},
																	profile150: {
																		label: '150x150',
																		type: 'text',
																		isRequired: true,
																	},
																	'profile60@2x': {
																		label: '60x60',
																		type: 'text',
																		isRequired: true,
																	},
																	'profile150@2x': {
																		label: '150x150',
																		type: 'text',
																		isRequired: true,
																	},
																},
															},
														},
													},
													dateCreated: { type: 'number', isRequired: true },
													dateScrambled: { type: 'number' },
												},
											},
										},
									},
									skill: {
										type: 'schema',
										options: {
											schema: {
												id: 'skill',
												version: 'v2020_07_22',
												namespace: 'Spruce',
												name: 'Skill',
												description: 'An ability Sprucebot has learned.',
												fields: {
													id: { label: 'Id', type: 'id', isRequired: true },
													apiKey: {
														label: 'Id',
														type: 'id',
														isPrivate: true,
														isRequired: true,
													},
													name: {
														label: 'Name',
														type: 'text',
														isRequired: true,
													},
													description: { label: 'Description', type: 'text' },
													slug: {
														label: 'Slug',
														type: 'text',
														isRequired: true,
													},
													creators: {
														label: 'Creators',
														type: 'schema',
														isPrivate: true,
														isRequired: true,
														hint:
															'The people or skills who created and own this skill.',
														isArray: true,
														options: {
															schema: {
																id: 'skillCreator',
																version: 'v2020_07_22',
																namespace: 'Spruce',
																name: 'Skill creator',
																fields: {
																	skillId: { type: 'text' },
																	personId: { type: 'text' },
																},
															},
														},
													},
													dateCreated: { type: 'number', isRequired: true },
													dateDeleted: { type: 'number' },
												},
											},
										},
									},
								},
							},
						},
					},
				},
			},
		},
		'can-listen': {
			emitPayloadSchema: {
				id: 'canListenTargetAndPayload',
				fields: {
					payload: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'canListenEmitPayload',
								fields: {
									authorizerStatuses: {
										type: 'select',
										options: {
											choices: [
												{ label: 'Clocked in', value: 'clockedIn' },
												{ label: 'Clocked out', value: 'clockedOut' },
												{ label: 'On premise', value: 'onPrem' },
												{ label: 'Off premise', value: 'offPrem' },
											],
										},
									},
									eventName: {
										type: 'text',
										isRequired: true,
									},
								},
							},
						},
					},
				},
			},
			responsePayloadSchema: {
				id: 'canListenResponsePayload',
				fields: { can: { type: 'boolean' } },
			},
		},
		'confirm-pin::v2020_12_25': {
			emitPayloadSchema: {
				id: 'confirmPinTargetAndPayload',
				fields: {
					payload: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'confirmPinEmitPayload',
								fields: {
									challenge: { type: 'text', isRequired: true },
									pin: { type: 'text', isRequired: true },
								},
							},
						},
					},
				},
			},
			responsePayloadSchema: {
				id: 'confirmPinRespondPayload',
				fields: {
					person: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'person',
								version: 'v2020_07_22',
								namespace: 'Spruce',
								name: 'Person',
								description: 'A human being.',
								fields: {
									id: { label: 'Id', type: 'id', isRequired: true },
									firstName: {
										label: 'First name',
										type: 'text',
										isPrivate: true,
									},
									lastName: {
										label: 'Last name',
										type: 'text',
										isPrivate: true,
									},
									casualName: {
										label: 'Casual name',
										type: 'text',
										isRequired: true,
										hint: 'The name you can use when talking to this person.',
									},
									phone: {
										label: 'Phone',
										type: 'phone',
										isPrivate: true,
										hint: 'A number that can be texted',
									},
									profileImages: {
										label: 'Profile photos',
										type: 'schema',
										options: {
											schema: {
												id: 'profileImage',
												version: 'v2020_07_22',
												namespace: 'Spruce',
												name: 'Profile Image Sizes',
												description:
													'Various sizes that a profile image comes in.',
												fields: {
													profile60: {
														label: '60x60',
														type: 'text',
														isRequired: true,
													},
													profile150: {
														label: '150x150',
														type: 'text',
														isRequired: true,
													},
													'profile60@2x': {
														label: '60x60',
														type: 'text',
														isRequired: true,
													},
													'profile150@2x': {
														label: '150x150',
														type: 'text',
														isRequired: true,
													},
												},
											},
										},
									},
									dateCreated: { type: 'number', isRequired: true },
									dateScrambled: { type: 'number' },
								},
							},
						},
					},
					token: { type: 'text', isRequired: true },
				},
			},
		},
		'create-location': {
			emitPayloadSchema: {
				id: 'createLocationTargetAndPayload',
				fields: {
					payload: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'createLocationEmitPayload',
								fields: {
									name: { label: 'Name', type: 'text', isRequired: true },
									num: {
										label: 'Store number',
										type: 'text',
										hint:
											'You can use other symbols, like # or dashes. #123 or 32-US-5',
									},
									isPublic: {
										label: 'Public',
										type: 'boolean',
										hint: 'Is this location viewable by guests?',
										defaultValue: false,
									},
									phone: { label: 'Main Phone', type: 'phone' },
									timezone: {
										label: 'Timezone',
										type: 'select',
										options: {
											choices: [
												{
													value: 'etc/gmt+12',
													label: 'International Date Line West',
												},
												{
													value: 'pacific/midway',
													label: 'Midway Island, Samoa',
												},
												{ value: 'pacific/honolulu', label: 'Hawaii' },
												{ value: 'us/alaska', label: 'Alaska' },
												{
													value: 'america/los_Angeles',
													label: 'Pacific Time (US & Canada)',
												},
												{
													value: 'america/tijuana',
													label: 'Tijuana, Baja California',
												},
												{ value: 'us/arizona', label: 'Arizona' },
												{
													value: 'america/chihuahua',
													label: 'Chihuahua, La Paz, Mazatlan',
												},
												{
													value: 'us/mountain',
													label: 'Mountain Time (US & Canada)',
												},
												{ value: 'america/managua', label: 'Central America' },
												{
													value: 'us/central',
													label: 'Central Time (US & Canada)',
												},
												{
													value: 'america/mexico_City',
													label: 'Guadalajara, Mexico City, Monterrey',
												},
												{ value: 'Canada/Saskatchewan', label: 'Saskatchewan' },
												{
													value: 'america/bogota',
													label: 'Bogota, Lima, Quito, Rio Branco',
												},
												{
													value: 'us/eastern',
													label: 'Eastern Time (US & Canada)',
												},
												{ value: 'us/east-indiana', label: 'Indiana (East)' },
												{
													value: 'Canada/atlantic',
													label: 'Atlantic Time (Canada)',
												},
												{ value: 'america/caracas', label: 'Caracas, La Paz' },
												{ value: 'america/manaus', label: 'Manaus' },
												{ value: 'america/Santiago', label: 'Santiago' },
												{ value: 'Canada/Newfoundland', label: 'Newfoundland' },
												{ value: 'america/Sao_Paulo', label: 'Brasilia' },
												{
													value: 'america/argentina/buenos_Aires',
													label: 'Buenos Aires, Georgetown',
												},
												{ value: 'america/godthab', label: 'Greenland' },
												{ value: 'america/montevideo', label: 'Montevideo' },
												{ value: 'america/Noronha', label: 'Mid-Atlantic' },
												{
													value: 'atlantic/cape_Verde',
													label: 'Cape Verde Is.',
												},
												{ value: 'atlantic/azores', label: 'Azores' },
												{
													value: 'africa/casablanca',
													label: 'Casablanca, Monrovia, Reykjavik',
												},
												{
													value: 'etc/gmt',
													label:
														'Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London',
												},
												{
													value: 'europe/amsterdam',
													label:
														'Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna',
												},
												{
													value: 'europe/belgrade',
													label:
														'Belgrade, Bratislava, Budapest, Ljubljana, Prague',
												},
												{
													value: 'europe/brussels',
													label: 'Brussels, Copenhagen, Madrid, Paris',
												},
												{
													value: 'europe/Sarajevo',
													label: 'Sarajevo, Skopje, Warsaw, Zagreb',
												},
												{ value: 'africa/lagos', label: 'West Central Africa' },
												{ value: 'asia/amman', label: 'Amman' },
												{
													value: 'europe/athens',
													label: 'Athens, Bucharest, Istanbul',
												},
												{ value: 'asia/beirut', label: 'Beirut' },
												{ value: 'africa/cairo', label: 'Cairo' },
												{ value: 'africa/Harare', label: 'Harare, Pretoria' },
												{
													value: 'europe/Helsinki',
													label:
														'Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius',
												},
												{ value: 'asia/Jerusalem', label: 'Jerusalem' },
												{ value: 'europe/minsk', label: 'Minsk' },
												{ value: 'africa/Windhoek', label: 'Windhoek' },
												{
													value: 'asia/Kuwait',
													label: 'Kuwait, Riyadh, Baghdad',
												},
												{
													value: 'europe/moscow',
													label: 'Moscow, St. Petersburg, Volgograd',
												},
												{ value: 'africa/Nairobi', label: 'Nairobi' },
												{ value: 'asia/tbilisi', label: 'Tbilisi' },
												{ value: 'asia/tehran', label: 'Tehran' },
												{ value: 'asia/muscat', label: 'Abu Dhabi, Muscat' },
												{ value: 'asia/baku', label: 'Baku' },
												{ value: 'asia/Yerevan', label: 'Yerevan' },
												{ value: 'asia/Kabul', label: 'Kabul' },
												{ value: 'asia/Yekaterinburg', label: 'Yekaterinburg' },
												{
													value: 'asia/Karachi',
													label: 'Islamabad, Karachi, Tashkent',
												},
												{
													value: 'asia/calcutta',
													label: 'Chennai, Kolkata, Mumbai, New Delhi',
												},
												{
													value: 'asia/calcutta',
													label: 'Sri Jayawardenapura',
												},
												{ value: 'asia/Katmandu', label: 'Kathmandu' },
												{ value: 'asia/almaty', label: 'Almaty, Novosibirsk' },
												{ value: 'asia/Dhaka', label: 'Astana, Dhaka' },
												{ value: 'asia/Rangoon', label: 'Yangon (Rangoon)' },
												{
													value: 'asia/bangkok',
													label: 'Bangkok, Hanoi, Jakarta',
												},
												{ value: 'asia/Krasnoyarsk', label: 'Krasnoyarsk' },
												{
													value: 'asia/Hong_Kong',
													label: 'Beijing, Chongqing, Hong Kong, Urumqi',
												},
												{
													value: 'asia/Kuala_Lumpur',
													label: 'Kuala Lumpur, Singapore',
												},
												{
													value: 'asia/Irkutsk',
													label: 'Irkutsk, Ulaan Bataar',
												},
												{ value: 'Australia/Perth', label: 'Perth' },
												{ value: 'asia/taipei', label: 'Taipei' },
												{ value: 'asia/tokyo', label: 'Osaka, Sapporo, Tokyo' },
												{ value: 'asia/Seoul', label: 'Seoul' },
												{ value: 'asia/Yakutsk', label: 'Yakutsk' },
												{ value: 'Australia/adelaide', label: 'Adelaide' },
												{ value: 'Australia/Darwin', label: 'Darwin' },
												{ value: 'Australia/brisbane', label: 'Brisbane' },
												{
													value: 'Australia/canberra',
													label: 'Canberra, Melbourne, Sydney',
												},
												{ value: 'Australia/Hobart', label: 'Hobart' },
												{ value: 'pacific/guam', label: 'Guam, Port Moresby' },
												{ value: 'asia/Vladivostok', label: 'Vladivostok' },
												{
													value: 'asia/magadan',
													label: 'Magadan, Solomon Is., New Caledonia',
												},
												{
													value: 'pacific/auckland',
													label: 'Auckland, Wellington',
												},
												{
													value: 'pacific/Fiji',
													label: 'Fiji, Kamchatka, Marshall Is.',
												},
												{ value: 'pacific/tongatapu', label: "Nuku'alofa" },
											],
										},
									},
									address: {
										label: 'Address',
										type: 'address',
										isRequired: true,
									},
									dateDeleted: { type: 'number' },
									slug: { type: 'text', isRequired: false },
								},
							},
						},
					},
					target: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'eventTargetSchema',
								fields: {
									locationId: { type: 'id' },
									personId: { type: 'id' },
									organizationId: { type: 'id' },
								},
							},
						},
					},
				},
			},
			responsePayloadSchema: {
				id: 'createLocationResponsePayload',
				fields: {
					location: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'location',
								version: 'v2020_07_22',
								namespace: 'Spruce',
								name: 'Location',
								description:
									'A physical location where people meet. An organization has at least one of them.',
								fields: {
									id: { label: 'Id', type: 'id', isRequired: true },
									name: { label: 'Name', type: 'text', isRequired: true },
									num: {
										label: 'Store number',
										type: 'text',
										hint:
											'You can use other symbols, like # or dashes. #123 or 32-US-5',
									},
									slug: { label: 'Slug', type: 'text', isRequired: true },
									isPublic: {
										label: 'Public',
										type: 'boolean',
										hint: 'Is this location viewable by guests?',
										defaultValue: false,
									},
									phone: { label: 'Main Phone', type: 'phone' },
									timezone: {
										label: 'Timezone',
										type: 'select',
										options: {
											choices: [
												{
													value: 'etc/gmt+12',
													label: 'International Date Line West',
												},
												{
													value: 'pacific/midway',
													label: 'Midway Island, Samoa',
												},
												{ value: 'pacific/honolulu', label: 'Hawaii' },
												{ value: 'us/alaska', label: 'Alaska' },
												{
													value: 'america/los_Angeles',
													label: 'Pacific Time (US & Canada)',
												},
												{
													value: 'america/tijuana',
													label: 'Tijuana, Baja California',
												},
												{ value: 'us/arizona', label: 'Arizona' },
												{
													value: 'america/chihuahua',
													label: 'Chihuahua, La Paz, Mazatlan',
												},
												{
													value: 'us/mountain',
													label: 'Mountain Time (US & Canada)',
												},
												{ value: 'america/managua', label: 'Central America' },
												{
													value: 'us/central',
													label: 'Central Time (US & Canada)',
												},
												{
													value: 'america/mexico_City',
													label: 'Guadalajara, Mexico City, Monterrey',
												},
												{ value: 'Canada/Saskatchewan', label: 'Saskatchewan' },
												{
													value: 'america/bogota',
													label: 'Bogota, Lima, Quito, Rio Branco',
												},
												{
													value: 'us/eastern',
													label: 'Eastern Time (US & Canada)',
												},
												{ value: 'us/east-indiana', label: 'Indiana (East)' },
												{
													value: 'Canada/atlantic',
													label: 'Atlantic Time (Canada)',
												},
												{ value: 'america/caracas', label: 'Caracas, La Paz' },
												{ value: 'america/manaus', label: 'Manaus' },
												{ value: 'america/Santiago', label: 'Santiago' },
												{ value: 'Canada/Newfoundland', label: 'Newfoundland' },
												{ value: 'america/Sao_Paulo', label: 'Brasilia' },
												{
													value: 'america/argentina/buenos_Aires',
													label: 'Buenos Aires, Georgetown',
												},
												{ value: 'america/godthab', label: 'Greenland' },
												{ value: 'america/montevideo', label: 'Montevideo' },
												{ value: 'america/Noronha', label: 'Mid-Atlantic' },
												{
													value: 'atlantic/cape_Verde',
													label: 'Cape Verde Is.',
												},
												{ value: 'atlantic/azores', label: 'Azores' },
												{
													value: 'africa/casablanca',
													label: 'Casablanca, Monrovia, Reykjavik',
												},
												{
													value: 'etc/gmt',
													label:
														'Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London',
												},
												{
													value: 'europe/amsterdam',
													label:
														'Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna',
												},
												{
													value: 'europe/belgrade',
													label:
														'Belgrade, Bratislava, Budapest, Ljubljana, Prague',
												},
												{
													value: 'europe/brussels',
													label: 'Brussels, Copenhagen, Madrid, Paris',
												},
												{
													value: 'europe/Sarajevo',
													label: 'Sarajevo, Skopje, Warsaw, Zagreb',
												},
												{ value: 'africa/lagos', label: 'West Central Africa' },
												{ value: 'asia/amman', label: 'Amman' },
												{
													value: 'europe/athens',
													label: 'Athens, Bucharest, Istanbul',
												},
												{ value: 'asia/beirut', label: 'Beirut' },
												{ value: 'africa/cairo', label: 'Cairo' },
												{ value: 'africa/Harare', label: 'Harare, Pretoria' },
												{
													value: 'europe/Helsinki',
													label:
														'Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius',
												},
												{ value: 'asia/Jerusalem', label: 'Jerusalem' },
												{ value: 'europe/minsk', label: 'Minsk' },
												{ value: 'africa/Windhoek', label: 'Windhoek' },
												{
													value: 'asia/Kuwait',
													label: 'Kuwait, Riyadh, Baghdad',
												},
												{
													value: 'europe/moscow',
													label: 'Moscow, St. Petersburg, Volgograd',
												},
												{ value: 'africa/Nairobi', label: 'Nairobi' },
												{ value: 'asia/tbilisi', label: 'Tbilisi' },
												{ value: 'asia/tehran', label: 'Tehran' },
												{ value: 'asia/muscat', label: 'Abu Dhabi, Muscat' },
												{ value: 'asia/baku', label: 'Baku' },
												{ value: 'asia/Yerevan', label: 'Yerevan' },
												{ value: 'asia/Kabul', label: 'Kabul' },
												{ value: 'asia/Yekaterinburg', label: 'Yekaterinburg' },
												{
													value: 'asia/Karachi',
													label: 'Islamabad, Karachi, Tashkent',
												},
												{
													value: 'asia/calcutta',
													label: 'Chennai, Kolkata, Mumbai, New Delhi',
												},
												{
													value: 'asia/calcutta',
													label: 'Sri Jayawardenapura',
												},
												{ value: 'asia/Katmandu', label: 'Kathmandu' },
												{ value: 'asia/almaty', label: 'Almaty, Novosibirsk' },
												{ value: 'asia/Dhaka', label: 'Astana, Dhaka' },
												{ value: 'asia/Rangoon', label: 'Yangon (Rangoon)' },
												{
													value: 'asia/bangkok',
													label: 'Bangkok, Hanoi, Jakarta',
												},
												{ value: 'asia/Krasnoyarsk', label: 'Krasnoyarsk' },
												{
													value: 'asia/Hong_Kong',
													label: 'Beijing, Chongqing, Hong Kong, Urumqi',
												},
												{
													value: 'asia/Kuala_Lumpur',
													label: 'Kuala Lumpur, Singapore',
												},
												{
													value: 'asia/Irkutsk',
													label: 'Irkutsk, Ulaan Bataar',
												},
												{ value: 'Australia/Perth', label: 'Perth' },
												{ value: 'asia/taipei', label: 'Taipei' },
												{ value: 'asia/tokyo', label: 'Osaka, Sapporo, Tokyo' },
												{ value: 'asia/Seoul', label: 'Seoul' },
												{ value: 'asia/Yakutsk', label: 'Yakutsk' },
												{ value: 'Australia/adelaide', label: 'Adelaide' },
												{ value: 'Australia/Darwin', label: 'Darwin' },
												{ value: 'Australia/brisbane', label: 'Brisbane' },
												{
													value: 'Australia/canberra',
													label: 'Canberra, Melbourne, Sydney',
												},
												{ value: 'Australia/Hobart', label: 'Hobart' },
												{ value: 'pacific/guam', label: 'Guam, Port Moresby' },
												{ value: 'asia/Vladivostok', label: 'Vladivostok' },
												{
													value: 'asia/magadan',
													label: 'Magadan, Solomon Is., New Caledonia',
												},
												{
													value: 'pacific/auckland',
													label: 'Auckland, Wellington',
												},
												{
													value: 'pacific/Fiji',
													label: 'Fiji, Kamchatka, Marshall Is.',
												},
												{ value: 'pacific/tongatapu', label: "Nuku'alofa" },
											],
										},
									},
									address: {
										label: 'Address',
										type: 'address',
										isRequired: true,
									},
									dateCreated: { type: 'number', isRequired: true },
									dateDeleted: { type: 'number' },
									organizationId: { type: 'id', isRequired: true },
								},
							},
						},
					},
				},
			},
		},
		'create-organization::v2020_12_25': {
			emitPayloadSchema: {
				id: 'createOrganizationTargetAndPayload',
				fields: {
					payload: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'createOrgEmitPayload',
								fields: {
									name: { label: 'Name', type: 'text', isRequired: true },
									slug: { type: 'text', isRequired: false },
									dateDeleted: { type: 'number' },
								},
							},
						},
					},
				},
			},
			responsePayloadSchema: {
				id: 'createOrgResponsePayload',
				fields: {
					organization: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'organization',
								version: 'v2020_07_22',
								namespace: 'Spruce',
								name: 'Organization',
								description:
									'A company or team. Comprises of many people and locations.',
								fields: {
									id: { label: 'Id', type: 'id', isRequired: true },
									name: { label: 'Name', type: 'text', isRequired: true },
									slug: { label: 'Slug', type: 'text', isRequired: true },
									dateCreated: { type: 'number', isRequired: true },
									dateDeleted: { type: 'number' },
								},
							},
						},
					},
				},
			},
		},
		'create-role': {
			emitPayloadSchema: {
				id: 'createRoleTargetAndPayload',
				fields: {
					payload: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'createRoleEmitPayload',
								fields: {
									name: { label: 'Name', type: 'text', isRequired: true },
									base: {
										label: 'Base',
										type: 'select',
										hint:
											'Used to determine the default permissions when this role is created and the fallback for when a permission is not set on this role.',
										options: {
											choices: [
												{ label: 'Owner', value: 'owner' },
												{ label: 'Group manager', value: 'groupManager' },
												{ label: 'Manager', value: 'manager' },
												{ label: 'Teammate', value: 'teammate' },
												{ label: 'Guest', value: 'guest' },
												{ label: 'Anonymous', value: 'anonymous' },
											],
										},
									},
									description: { label: 'Description', type: 'text' },
									dateDeleted: { type: 'number' },
									isPublic: {
										label: 'Public',
										type: 'boolean',
										hint:
											'Should I let people that are not part of this organization this role?',
									},
								},
							},
						},
					},
					target: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'eventTargetSchema',
								fields: {
									locationId: { type: 'id' },
									personId: { type: 'id' },
									organizationId: { type: 'id' },
								},
							},
						},
					},
				},
			},
			responsePayloadSchema: {
				id: 'createRoleResponsePayload',
				fields: {
					role: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'role',
								version: 'v2020_07_22',
								namespace: 'Spruce',
								name: 'Role',
								description:
									'Every role in Spruce inherits from 5 bases. Owner, Group Manager, Manager, Teammate, and Guest.',
								fields: {
									id: { label: 'Id', type: 'id', isRequired: true },
									name: { label: 'Name', type: 'text', isRequired: true },
									base: {
										label: 'Base',
										type: 'select',
										hint:
											'Used to determine the default permissions when this role is created and the fallback for when a permission is not set on this role.',
										options: {
											choices: [
												{ label: 'Owner', value: 'owner' },
												{ label: 'Group manager', value: 'groupManager' },
												{ label: 'Manager', value: 'manager' },
												{ label: 'Teammate', value: 'teammate' },
												{ label: 'Guest', value: 'guest' },
												{ label: 'Anonymous', value: 'anonymous' },
											],
										},
									},
									description: { label: 'Description', type: 'text' },
									dateCreated: { type: 'number', isRequired: true },
									dateDeleted: { type: 'number' },
									organizationId: { type: 'id' },
									isPublic: {
										label: 'Public',
										type: 'boolean',
										hint:
											'Should I let people that are not part of this organization this role?',
									},
								},
							},
						},
					},
				},
			},
		},
		'delete-location': {
			emitPayloadSchema: {
				id: 'deleteLocationTargetAndPayload',
				fields: {
					payload: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'deleteLocationEmitPayload',
								fields: { id: { type: 'id', isRequired: true } },
							},
						},
					},
					target: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'eventTargetSchema',
								fields: {
									locationId: { type: 'id' },
									personId: { type: 'id' },
									organizationId: { type: 'id' },
								},
							},
						},
					},
				},
			},
			responsePayloadSchema: {
				id: 'deleteLocationResponsePayload',
				fields: {
					location: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'location',
								version: 'v2020_07_22',
								namespace: 'Spruce',
								name: 'Location',
								description:
									'A physical location where people meet. An organization has at least one of them.',
								fields: {
									id: { label: 'Id', type: 'id', isRequired: true },
									name: { label: 'Name', type: 'text', isRequired: true },
									num: {
										label: 'Store number',
										type: 'text',
										hint:
											'You can use other symbols, like # or dashes. #123 or 32-US-5',
									},
									slug: { label: 'Slug', type: 'text', isRequired: true },
									isPublic: {
										label: 'Public',
										type: 'boolean',
										hint: 'Is this location viewable by guests?',
										defaultValue: false,
									},
									phone: { label: 'Main Phone', type: 'phone' },
									timezone: {
										label: 'Timezone',
										type: 'select',
										options: {
											choices: [
												{
													value: 'etc/gmt+12',
													label: 'International Date Line West',
												},
												{
													value: 'pacific/midway',
													label: 'Midway Island, Samoa',
												},
												{ value: 'pacific/honolulu', label: 'Hawaii' },
												{ value: 'us/alaska', label: 'Alaska' },
												{
													value: 'america/los_Angeles',
													label: 'Pacific Time (US & Canada)',
												},
												{
													value: 'america/tijuana',
													label: 'Tijuana, Baja California',
												},
												{ value: 'us/arizona', label: 'Arizona' },
												{
													value: 'america/chihuahua',
													label: 'Chihuahua, La Paz, Mazatlan',
												},
												{
													value: 'us/mountain',
													label: 'Mountain Time (US & Canada)',
												},
												{ value: 'america/managua', label: 'Central America' },
												{
													value: 'us/central',
													label: 'Central Time (US & Canada)',
												},
												{
													value: 'america/mexico_City',
													label: 'Guadalajara, Mexico City, Monterrey',
												},
												{ value: 'Canada/Saskatchewan', label: 'Saskatchewan' },
												{
													value: 'america/bogota',
													label: 'Bogota, Lima, Quito, Rio Branco',
												},
												{
													value: 'us/eastern',
													label: 'Eastern Time (US & Canada)',
												},
												{ value: 'us/east-indiana', label: 'Indiana (East)' },
												{
													value: 'Canada/atlantic',
													label: 'Atlantic Time (Canada)',
												},
												{ value: 'america/caracas', label: 'Caracas, La Paz' },
												{ value: 'america/manaus', label: 'Manaus' },
												{ value: 'america/Santiago', label: 'Santiago' },
												{ value: 'Canada/Newfoundland', label: 'Newfoundland' },
												{ value: 'america/Sao_Paulo', label: 'Brasilia' },
												{
													value: 'america/argentina/buenos_Aires',
													label: 'Buenos Aires, Georgetown',
												},
												{ value: 'america/godthab', label: 'Greenland' },
												{ value: 'america/montevideo', label: 'Montevideo' },
												{ value: 'america/Noronha', label: 'Mid-Atlantic' },
												{
													value: 'atlantic/cape_Verde',
													label: 'Cape Verde Is.',
												},
												{ value: 'atlantic/azores', label: 'Azores' },
												{
													value: 'africa/casablanca',
													label: 'Casablanca, Monrovia, Reykjavik',
												},
												{
													value: 'etc/gmt',
													label:
														'Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London',
												},
												{
													value: 'europe/amsterdam',
													label:
														'Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna',
												},
												{
													value: 'europe/belgrade',
													label:
														'Belgrade, Bratislava, Budapest, Ljubljana, Prague',
												},
												{
													value: 'europe/brussels',
													label: 'Brussels, Copenhagen, Madrid, Paris',
												},
												{
													value: 'europe/Sarajevo',
													label: 'Sarajevo, Skopje, Warsaw, Zagreb',
												},
												{ value: 'africa/lagos', label: 'West Central Africa' },
												{ value: 'asia/amman', label: 'Amman' },
												{
													value: 'europe/athens',
													label: 'Athens, Bucharest, Istanbul',
												},
												{ value: 'asia/beirut', label: 'Beirut' },
												{ value: 'africa/cairo', label: 'Cairo' },
												{ value: 'africa/Harare', label: 'Harare, Pretoria' },
												{
													value: 'europe/Helsinki',
													label:
														'Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius',
												},
												{ value: 'asia/Jerusalem', label: 'Jerusalem' },
												{ value: 'europe/minsk', label: 'Minsk' },
												{ value: 'africa/Windhoek', label: 'Windhoek' },
												{
													value: 'asia/Kuwait',
													label: 'Kuwait, Riyadh, Baghdad',
												},
												{
													value: 'europe/moscow',
													label: 'Moscow, St. Petersburg, Volgograd',
												},
												{ value: 'africa/Nairobi', label: 'Nairobi' },
												{ value: 'asia/tbilisi', label: 'Tbilisi' },
												{ value: 'asia/tehran', label: 'Tehran' },
												{ value: 'asia/muscat', label: 'Abu Dhabi, Muscat' },
												{ value: 'asia/baku', label: 'Baku' },
												{ value: 'asia/Yerevan', label: 'Yerevan' },
												{ value: 'asia/Kabul', label: 'Kabul' },
												{ value: 'asia/Yekaterinburg', label: 'Yekaterinburg' },
												{
													value: 'asia/Karachi',
													label: 'Islamabad, Karachi, Tashkent',
												},
												{
													value: 'asia/calcutta',
													label: 'Chennai, Kolkata, Mumbai, New Delhi',
												},
												{
													value: 'asia/calcutta',
													label: 'Sri Jayawardenapura',
												},
												{ value: 'asia/Katmandu', label: 'Kathmandu' },
												{ value: 'asia/almaty', label: 'Almaty, Novosibirsk' },
												{ value: 'asia/Dhaka', label: 'Astana, Dhaka' },
												{ value: 'asia/Rangoon', label: 'Yangon (Rangoon)' },
												{
													value: 'asia/bangkok',
													label: 'Bangkok, Hanoi, Jakarta',
												},
												{ value: 'asia/Krasnoyarsk', label: 'Krasnoyarsk' },
												{
													value: 'asia/Hong_Kong',
													label: 'Beijing, Chongqing, Hong Kong, Urumqi',
												},
												{
													value: 'asia/Kuala_Lumpur',
													label: 'Kuala Lumpur, Singapore',
												},
												{
													value: 'asia/Irkutsk',
													label: 'Irkutsk, Ulaan Bataar',
												},
												{ value: 'Australia/Perth', label: 'Perth' },
												{ value: 'asia/taipei', label: 'Taipei' },
												{ value: 'asia/tokyo', label: 'Osaka, Sapporo, Tokyo' },
												{ value: 'asia/Seoul', label: 'Seoul' },
												{ value: 'asia/Yakutsk', label: 'Yakutsk' },
												{ value: 'Australia/adelaide', label: 'Adelaide' },
												{ value: 'Australia/Darwin', label: 'Darwin' },
												{ value: 'Australia/brisbane', label: 'Brisbane' },
												{
													value: 'Australia/canberra',
													label: 'Canberra, Melbourne, Sydney',
												},
												{ value: 'Australia/Hobart', label: 'Hobart' },
												{ value: 'pacific/guam', label: 'Guam, Port Moresby' },
												{ value: 'asia/Vladivostok', label: 'Vladivostok' },
												{
													value: 'asia/magadan',
													label: 'Magadan, Solomon Is., New Caledonia',
												},
												{
													value: 'pacific/auckland',
													label: 'Auckland, Wellington',
												},
												{
													value: 'pacific/Fiji',
													label: 'Fiji, Kamchatka, Marshall Is.',
												},
												{ value: 'pacific/tongatapu', label: "Nuku'alofa" },
											],
										},
									},
									address: {
										label: 'Address',
										type: 'address',
										isRequired: true,
									},
									dateCreated: { type: 'number', isRequired: true },
									dateDeleted: { type: 'number' },
									organizationId: { type: 'id', isRequired: true },
								},
							},
						},
					},
				},
			},
		},
		'delete-organization': {
			emitPayloadSchema: {
				id: 'deleteOrganizationTargetAndPayload',
				fields: {
					target: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'eventTargetSchema',
								fields: {
									locationId: { type: 'id' },
									personId: { type: 'id' },
									organizationId: { type: 'id' },
								},
							},
						},
					},
				},
			},
			responsePayloadSchema: {
				id: 'deleteOrgResponsePayload',
				fields: {
					organization: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'organization',
								version: 'v2020_07_22',
								namespace: 'Spruce',
								name: 'Organization',
								description:
									'A company or team. Comprises of many people and locations.',
								fields: {
									id: { label: 'Id', type: 'id', isRequired: true },
									name: { label: 'Name', type: 'text', isRequired: true },
									slug: { label: 'Slug', type: 'text', isRequired: true },
									dateCreated: { type: 'number', isRequired: true },
									dateDeleted: { type: 'number' },
								},
							},
						},
					},
				},
			},
		},
		'delete-role': {
			emitPayloadSchema: {
				id: 'deleteRoleTargetAndPayload',
				fields: {
					payload: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'deleteRoleEmitPayload',
								fields: {
									id: { type: 'id', isRequired: true },
									organizationId: { type: 'id' },
								},
							},
						},
					},
					target: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'eventTargetSchema',
								fields: {
									locationId: { type: 'id' },
									personId: { type: 'id' },
									organizationId: { type: 'id' },
								},
							},
						},
					},
				},
			},
			responsePayloadSchema: {
				id: 'deleteRoleResponsePayload',
				fields: {
					role: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'role',
								version: 'v2020_07_22',
								namespace: 'Spruce',
								name: 'Role',
								description:
									'Every role in Spruce inherits from 5 bases. Owner, Group Manager, Manager, Teammate, and Guest.',
								fields: {
									id: { label: 'Id', type: 'id', isRequired: true },
									name: { label: 'Name', type: 'text', isRequired: true },
									base: {
										label: 'Base',
										type: 'select',
										hint:
											'Used to determine the default permissions when this role is created and the fallback for when a permission is not set on this role.',
										options: {
											choices: [
												{ label: 'Owner', value: 'owner' },
												{ label: 'Group manager', value: 'groupManager' },
												{ label: 'Manager', value: 'manager' },
												{ label: 'Teammate', value: 'teammate' },
												{ label: 'Guest', value: 'guest' },
												{ label: 'Anonymous', value: 'anonymous' },
											],
										},
									},
									description: { label: 'Description', type: 'text' },
									dateCreated: { type: 'number', isRequired: true },
									dateDeleted: { type: 'number' },
									organizationId: { type: 'id' },
									isPublic: {
										label: 'Public',
										type: 'boolean',
										hint:
											'Should I let people that are not part of this organization this role?',
									},
								},
							},
						},
					},
				},
			},
		},
		'get-event-contracts': {
			emitPayloadSchema: {
				id: 'getEventContractsTargetAndPayload',
				fields: {
					payload: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: { id: 'getEventContractsEmitPayload', fields: {} },
						},
					},
				},
			},
		},
		'get-location': {
			emitPayloadSchema: {
				id: 'getLocationTargetAndPayload',
				fields: {
					payload: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'getLocationEmitPayload',
								fields: { id: { type: 'id', isRequired: true } },
							},
						},
					},
					target: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'eventTargetSchema',
								fields: {
									locationId: { type: 'id' },
									personId: { type: 'id' },
									organizationId: { type: 'id' },
								},
							},
						},
					},
				},
			},
			responsePayloadSchema: {
				id: 'getLocationResponsePayload',
				fields: {
					location: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'location',
								version: 'v2020_07_22',
								namespace: 'Spruce',
								name: 'Location',
								description:
									'A physical location where people meet. An organization has at least one of them.',
								fields: {
									id: { label: 'Id', type: 'id', isRequired: true },
									name: { label: 'Name', type: 'text', isRequired: true },
									num: {
										label: 'Store number',
										type: 'text',
										hint:
											'You can use other symbols, like # or dashes. #123 or 32-US-5',
									},
									slug: { label: 'Slug', type: 'text', isRequired: true },
									isPublic: {
										label: 'Public',
										type: 'boolean',
										hint: 'Is this location viewable by guests?',
										defaultValue: false,
									},
									phone: { label: 'Main Phone', type: 'phone' },
									timezone: {
										label: 'Timezone',
										type: 'select',
										options: {
											choices: [
												{
													value: 'etc/gmt+12',
													label: 'International Date Line West',
												},
												{
													value: 'pacific/midway',
													label: 'Midway Island, Samoa',
												},
												{ value: 'pacific/honolulu', label: 'Hawaii' },
												{ value: 'us/alaska', label: 'Alaska' },
												{
													value: 'america/los_Angeles',
													label: 'Pacific Time (US & Canada)',
												},
												{
													value: 'america/tijuana',
													label: 'Tijuana, Baja California',
												},
												{ value: 'us/arizona', label: 'Arizona' },
												{
													value: 'america/chihuahua',
													label: 'Chihuahua, La Paz, Mazatlan',
												},
												{
													value: 'us/mountain',
													label: 'Mountain Time (US & Canada)',
												},
												{ value: 'america/managua', label: 'Central America' },
												{
													value: 'us/central',
													label: 'Central Time (US & Canada)',
												},
												{
													value: 'america/mexico_City',
													label: 'Guadalajara, Mexico City, Monterrey',
												},
												{ value: 'Canada/Saskatchewan', label: 'Saskatchewan' },
												{
													value: 'america/bogota',
													label: 'Bogota, Lima, Quito, Rio Branco',
												},
												{
													value: 'us/eastern',
													label: 'Eastern Time (US & Canada)',
												},
												{ value: 'us/east-indiana', label: 'Indiana (East)' },
												{
													value: 'Canada/atlantic',
													label: 'Atlantic Time (Canada)',
												},
												{ value: 'america/caracas', label: 'Caracas, La Paz' },
												{ value: 'america/manaus', label: 'Manaus' },
												{ value: 'america/Santiago', label: 'Santiago' },
												{ value: 'Canada/Newfoundland', label: 'Newfoundland' },
												{ value: 'america/Sao_Paulo', label: 'Brasilia' },
												{
													value: 'america/argentina/buenos_Aires',
													label: 'Buenos Aires, Georgetown',
												},
												{ value: 'america/godthab', label: 'Greenland' },
												{ value: 'america/montevideo', label: 'Montevideo' },
												{ value: 'america/Noronha', label: 'Mid-Atlantic' },
												{
													value: 'atlantic/cape_Verde',
													label: 'Cape Verde Is.',
												},
												{ value: 'atlantic/azores', label: 'Azores' },
												{
													value: 'africa/casablanca',
													label: 'Casablanca, Monrovia, Reykjavik',
												},
												{
													value: 'etc/gmt',
													label:
														'Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London',
												},
												{
													value: 'europe/amsterdam',
													label:
														'Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna',
												},
												{
													value: 'europe/belgrade',
													label:
														'Belgrade, Bratislava, Budapest, Ljubljana, Prague',
												},
												{
													value: 'europe/brussels',
													label: 'Brussels, Copenhagen, Madrid, Paris',
												},
												{
													value: 'europe/Sarajevo',
													label: 'Sarajevo, Skopje, Warsaw, Zagreb',
												},
												{ value: 'africa/lagos', label: 'West Central Africa' },
												{ value: 'asia/amman', label: 'Amman' },
												{
													value: 'europe/athens',
													label: 'Athens, Bucharest, Istanbul',
												},
												{ value: 'asia/beirut', label: 'Beirut' },
												{ value: 'africa/cairo', label: 'Cairo' },
												{ value: 'africa/Harare', label: 'Harare, Pretoria' },
												{
													value: 'europe/Helsinki',
													label:
														'Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius',
												},
												{ value: 'asia/Jerusalem', label: 'Jerusalem' },
												{ value: 'europe/minsk', label: 'Minsk' },
												{ value: 'africa/Windhoek', label: 'Windhoek' },
												{
													value: 'asia/Kuwait',
													label: 'Kuwait, Riyadh, Baghdad',
												},
												{
													value: 'europe/moscow',
													label: 'Moscow, St. Petersburg, Volgograd',
												},
												{ value: 'africa/Nairobi', label: 'Nairobi' },
												{ value: 'asia/tbilisi', label: 'Tbilisi' },
												{ value: 'asia/tehran', label: 'Tehran' },
												{ value: 'asia/muscat', label: 'Abu Dhabi, Muscat' },
												{ value: 'asia/baku', label: 'Baku' },
												{ value: 'asia/Yerevan', label: 'Yerevan' },
												{ value: 'asia/Kabul', label: 'Kabul' },
												{ value: 'asia/Yekaterinburg', label: 'Yekaterinburg' },
												{
													value: 'asia/Karachi',
													label: 'Islamabad, Karachi, Tashkent',
												},
												{
													value: 'asia/calcutta',
													label: 'Chennai, Kolkata, Mumbai, New Delhi',
												},
												{
													value: 'asia/calcutta',
													label: 'Sri Jayawardenapura',
												},
												{ value: 'asia/Katmandu', label: 'Kathmandu' },
												{ value: 'asia/almaty', label: 'Almaty, Novosibirsk' },
												{ value: 'asia/Dhaka', label: 'Astana, Dhaka' },
												{ value: 'asia/Rangoon', label: 'Yangon (Rangoon)' },
												{
													value: 'asia/bangkok',
													label: 'Bangkok, Hanoi, Jakarta',
												},
												{ value: 'asia/Krasnoyarsk', label: 'Krasnoyarsk' },
												{
													value: 'asia/Hong_Kong',
													label: 'Beijing, Chongqing, Hong Kong, Urumqi',
												},
												{
													value: 'asia/Kuala_Lumpur',
													label: 'Kuala Lumpur, Singapore',
												},
												{
													value: 'asia/Irkutsk',
													label: 'Irkutsk, Ulaan Bataar',
												},
												{ value: 'Australia/Perth', label: 'Perth' },
												{ value: 'asia/taipei', label: 'Taipei' },
												{ value: 'asia/tokyo', label: 'Osaka, Sapporo, Tokyo' },
												{ value: 'asia/Seoul', label: 'Seoul' },
												{ value: 'asia/Yakutsk', label: 'Yakutsk' },
												{ value: 'Australia/adelaide', label: 'Adelaide' },
												{ value: 'Australia/Darwin', label: 'Darwin' },
												{ value: 'Australia/brisbane', label: 'Brisbane' },
												{
													value: 'Australia/canberra',
													label: 'Canberra, Melbourne, Sydney',
												},
												{ value: 'Australia/Hobart', label: 'Hobart' },
												{ value: 'pacific/guam', label: 'Guam, Port Moresby' },
												{ value: 'asia/Vladivostok', label: 'Vladivostok' },
												{
													value: 'asia/magadan',
													label: 'Magadan, Solomon Is., New Caledonia',
												},
												{
													value: 'pacific/auckland',
													label: 'Auckland, Wellington',
												},
												{
													value: 'pacific/Fiji',
													label: 'Fiji, Kamchatka, Marshall Is.',
												},
												{ value: 'pacific/tongatapu', label: "Nuku'alofa" },
											],
										},
									},
									address: {
										label: 'Address',
										type: 'address',
										isRequired: true,
									},
									dateCreated: { type: 'number', isRequired: true },
									dateDeleted: { type: 'number' },
									organizationId: { type: 'id', isRequired: true },
								},
							},
						},
					},
				},
			},
		},
		'get-organization': {
			emitPayloadSchema: {
				id: 'getOrganizationTargetAndPayload',
				fields: {
					target: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'eventTargetSchema',
								fields: {
									locationId: { type: 'id' },
									personId: { type: 'id' },
									organizationId: { type: 'id' },
								},
							},
						},
					},
				},
			},
			responsePayloadSchema: {
				id: 'getOrgResponsePayload',
				fields: {
					organization: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'organization',
								version: 'v2020_07_22',
								namespace: 'Spruce',
								name: 'Organization',
								description:
									'A company or team. Comprises of many people and locations.',
								fields: {
									id: { label: 'Id', type: 'id', isRequired: true },
									name: { label: 'Name', type: 'text', isRequired: true },
									slug: { label: 'Slug', type: 'text', isRequired: true },
									dateCreated: { type: 'number', isRequired: true },
									dateDeleted: { type: 'number' },
								},
							},
						},
					},
				},
			},
		},
		'get-role': {
			emitPayloadSchema: {
				id: 'getRoleTargetAndPayload',
				fields: {
					payload: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'getRoleEmitPayload',
								fields: { id: { type: 'id', isRequired: true } },
							},
						},
					},
					target: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'eventTargetSchema',
								fields: {
									locationId: { type: 'id' },
									personId: { type: 'id' },
									organizationId: { type: 'id' },
								},
							},
						},
					},
				},
			},
			responsePayloadSchema: {
				id: 'getRoleResponsePayload',
				fields: {
					role: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'role',
								version: 'v2020_07_22',
								namespace: 'Spruce',
								name: 'Role',
								description:
									'Every role in Spruce inherits from 5 bases. Owner, Group Manager, Manager, Teammate, and Guest.',
								fields: {
									id: { label: 'Id', type: 'id', isRequired: true },
									name: { label: 'Name', type: 'text', isRequired: true },
									base: {
										label: 'Base',
										type: 'select',
										hint:
											'Used to determine the default permissions when this role is created and the fallback for when a permission is not set on this role.',
										options: {
											choices: [
												{ label: 'Owner', value: 'owner' },
												{ label: 'Group manager', value: 'groupManager' },
												{ label: 'Manager', value: 'manager' },
												{ label: 'Teammate', value: 'teammate' },
												{ label: 'Guest', value: 'guest' },
												{ label: 'Anonymous', value: 'anonymous' },
											],
										},
									},
									description: { label: 'Description', type: 'text' },
									dateCreated: { type: 'number', isRequired: true },
									dateDeleted: { type: 'number' },
									organizationId: { type: 'id' },
									isPublic: {
										label: 'Public',
										type: 'boolean',
										hint:
											'Should I let people that are not part of this organization this role?',
									},
								},
							},
						},
					},
				},
			},
		},
		'health::v2020_12_25': {
			responsePayloadSchema: buildSchema({
				id: 'healthResponsePayload',
				fields: {
					skill: {
						type: 'schema',
						options: {
							schema: {
								id: 'healthCheckItem',
								fields: {
									status: {
										type: 'select',
										options: {
											choices: [{ value: 'passed', label: 'Passed' }],
										},
									},
								},
							},
						},
					},
					mercury: {
						type: 'schema',
						options: {
							schema: {
								id: 'healthCheckItem',
								fields: {
									status: {
										type: 'select',
										options: {
											choices: [{ value: 'passed', label: 'Passed' }],
										},
									},
								},
							},
						},
					},
				},
			}),
		},
		'install-skill::v2020_12_25': {
			emitPayloadSchema: {
				id: 'installSkillTargetAndPayload',
				fields: {
					payload: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'installSkillEmitPayload',
								fields: { skillId: { type: 'id', isRequired: true } },
							},
						},
					},
					target: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'eventTargetSchema',
								fields: {
									locationId: { type: 'id' },
									personId: { type: 'id' },
									organizationId: { type: 'id' },
								},
							},
						},
					},
				},
			},
			responsePayloadSchema: { id: 'installSkillResponsePayload', fields: {} },
		},
		'list-locations': {
			emitPayloadSchema: {
				id: 'listLocationsTargetAndPayload',
				fields: {
					payload: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'listLocationsEmitPayload',
								fields: { includePrivateLocations: { type: 'boolean' } },
							},
						},
					},
					target: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'eventTargetSchema',
								fields: {
									locationId: { type: 'id' },
									personId: { type: 'id' },
									organizationId: { type: 'id' },
								},
							},
						},
					},
				},
			},
			responsePayloadSchema: {
				id: 'listLocationsResponsePayload',
				fields: {
					locations: {
						type: 'schema',
						isRequired: true,
						isArray: true,
						options: {
							schema: {
								id: 'location',
								version: 'v2020_07_22',
								namespace: 'Spruce',
								name: 'Location',
								description:
									'A physical location where people meet. An organization has at least one of them.',
								fields: {
									id: { label: 'Id', type: 'id', isRequired: true },
									name: { label: 'Name', type: 'text', isRequired: true },
									num: {
										label: 'Store number',
										type: 'text',
										hint:
											'You can use other symbols, like # or dashes. #123 or 32-US-5',
									},
									slug: { label: 'Slug', type: 'text', isRequired: true },
									isPublic: {
										label: 'Public',
										type: 'boolean',
										hint: 'Is this location viewable by guests?',
										defaultValue: false,
									},
									phone: { label: 'Main Phone', type: 'phone' },
									timezone: {
										label: 'Timezone',
										type: 'select',
										options: {
											choices: [
												{
													value: 'etc/gmt+12',
													label: 'International Date Line West',
												},
												{
													value: 'pacific/midway',
													label: 'Midway Island, Samoa',
												},
												{ value: 'pacific/honolulu', label: 'Hawaii' },
												{ value: 'us/alaska', label: 'Alaska' },
												{
													value: 'america/los_Angeles',
													label: 'Pacific Time (US & Canada)',
												},
												{
													value: 'america/tijuana',
													label: 'Tijuana, Baja California',
												},
												{ value: 'us/arizona', label: 'Arizona' },
												{
													value: 'america/chihuahua',
													label: 'Chihuahua, La Paz, Mazatlan',
												},
												{
													value: 'us/mountain',
													label: 'Mountain Time (US & Canada)',
												},
												{ value: 'america/managua', label: 'Central America' },
												{
													value: 'us/central',
													label: 'Central Time (US & Canada)',
												},
												{
													value: 'america/mexico_City',
													label: 'Guadalajara, Mexico City, Monterrey',
												},
												{ value: 'Canada/Saskatchewan', label: 'Saskatchewan' },
												{
													value: 'america/bogota',
													label: 'Bogota, Lima, Quito, Rio Branco',
												},
												{
													value: 'us/eastern',
													label: 'Eastern Time (US & Canada)',
												},
												{ value: 'us/east-indiana', label: 'Indiana (East)' },
												{
													value: 'Canada/atlantic',
													label: 'Atlantic Time (Canada)',
												},
												{ value: 'america/caracas', label: 'Caracas, La Paz' },
												{ value: 'america/manaus', label: 'Manaus' },
												{ value: 'america/Santiago', label: 'Santiago' },
												{ value: 'Canada/Newfoundland', label: 'Newfoundland' },
												{ value: 'america/Sao_Paulo', label: 'Brasilia' },
												{
													value: 'america/argentina/buenos_Aires',
													label: 'Buenos Aires, Georgetown',
												},
												{ value: 'america/godthab', label: 'Greenland' },
												{ value: 'america/montevideo', label: 'Montevideo' },
												{ value: 'america/Noronha', label: 'Mid-Atlantic' },
												{
													value: 'atlantic/cape_Verde',
													label: 'Cape Verde Is.',
												},
												{ value: 'atlantic/azores', label: 'Azores' },
												{
													value: 'africa/casablanca',
													label: 'Casablanca, Monrovia, Reykjavik',
												},
												{
													value: 'etc/gmt',
													label:
														'Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London',
												},
												{
													value: 'europe/amsterdam',
													label:
														'Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna',
												},
												{
													value: 'europe/belgrade',
													label:
														'Belgrade, Bratislava, Budapest, Ljubljana, Prague',
												},
												{
													value: 'europe/brussels',
													label: 'Brussels, Copenhagen, Madrid, Paris',
												},
												{
													value: 'europe/Sarajevo',
													label: 'Sarajevo, Skopje, Warsaw, Zagreb',
												},
												{ value: 'africa/lagos', label: 'West Central Africa' },
												{ value: 'asia/amman', label: 'Amman' },
												{
													value: 'europe/athens',
													label: 'Athens, Bucharest, Istanbul',
												},
												{ value: 'asia/beirut', label: 'Beirut' },
												{ value: 'africa/cairo', label: 'Cairo' },
												{ value: 'africa/Harare', label: 'Harare, Pretoria' },
												{
													value: 'europe/Helsinki',
													label:
														'Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius',
												},
												{ value: 'asia/Jerusalem', label: 'Jerusalem' },
												{ value: 'europe/minsk', label: 'Minsk' },
												{ value: 'africa/Windhoek', label: 'Windhoek' },
												{
													value: 'asia/Kuwait',
													label: 'Kuwait, Riyadh, Baghdad',
												},
												{
													value: 'europe/moscow',
													label: 'Moscow, St. Petersburg, Volgograd',
												},
												{ value: 'africa/Nairobi', label: 'Nairobi' },
												{ value: 'asia/tbilisi', label: 'Tbilisi' },
												{ value: 'asia/tehran', label: 'Tehran' },
												{ value: 'asia/muscat', label: 'Abu Dhabi, Muscat' },
												{ value: 'asia/baku', label: 'Baku' },
												{ value: 'asia/Yerevan', label: 'Yerevan' },
												{ value: 'asia/Kabul', label: 'Kabul' },
												{ value: 'asia/Yekaterinburg', label: 'Yekaterinburg' },
												{
													value: 'asia/Karachi',
													label: 'Islamabad, Karachi, Tashkent',
												},
												{
													value: 'asia/calcutta',
													label: 'Chennai, Kolkata, Mumbai, New Delhi',
												},
												{
													value: 'asia/calcutta',
													label: 'Sri Jayawardenapura',
												},
												{ value: 'asia/Katmandu', label: 'Kathmandu' },
												{ value: 'asia/almaty', label: 'Almaty, Novosibirsk' },
												{ value: 'asia/Dhaka', label: 'Astana, Dhaka' },
												{ value: 'asia/Rangoon', label: 'Yangon (Rangoon)' },
												{
													value: 'asia/bangkok',
													label: 'Bangkok, Hanoi, Jakarta',
												},
												{ value: 'asia/Krasnoyarsk', label: 'Krasnoyarsk' },
												{
													value: 'asia/Hong_Kong',
													label: 'Beijing, Chongqing, Hong Kong, Urumqi',
												},
												{
													value: 'asia/Kuala_Lumpur',
													label: 'Kuala Lumpur, Singapore',
												},
												{
													value: 'asia/Irkutsk',
													label: 'Irkutsk, Ulaan Bataar',
												},
												{ value: 'Australia/Perth', label: 'Perth' },
												{ value: 'asia/taipei', label: 'Taipei' },
												{ value: 'asia/tokyo', label: 'Osaka, Sapporo, Tokyo' },
												{ value: 'asia/Seoul', label: 'Seoul' },
												{ value: 'asia/Yakutsk', label: 'Yakutsk' },
												{ value: 'Australia/adelaide', label: 'Adelaide' },
												{ value: 'Australia/Darwin', label: 'Darwin' },
												{ value: 'Australia/brisbane', label: 'Brisbane' },
												{
													value: 'Australia/canberra',
													label: 'Canberra, Melbourne, Sydney',
												},
												{ value: 'Australia/Hobart', label: 'Hobart' },
												{ value: 'pacific/guam', label: 'Guam, Port Moresby' },
												{ value: 'asia/Vladivostok', label: 'Vladivostok' },
												{
													value: 'asia/magadan',
													label: 'Magadan, Solomon Is., New Caledonia',
												},
												{
													value: 'pacific/auckland',
													label: 'Auckland, Wellington',
												},
												{
													value: 'pacific/Fiji',
													label: 'Fiji, Kamchatka, Marshall Is.',
												},
												{ value: 'pacific/tongatapu', label: "Nuku'alofa" },
											],
										},
									},
									address: {
										label: 'Address',
										type: 'address',
										isRequired: true,
									},
									dateCreated: { type: 'number', isRequired: true },
									dateDeleted: { type: 'number' },
									organizationId: { type: 'id', isRequired: true },
								},
							},
						},
					},
				},
			},
		},
		'list-organizations': {
			emitPayloadSchema: {
				id: 'listOrganizationsTargetAndPayload',
				fields: {
					payload: {
						type: 'schema',
						isRequired: true,
						options: { schema: { id: 'listOrgs', fields: {} } },
					},
				},
			},
			responsePayloadSchema: {
				id: 'listOrgsResponsePayload',
				fields: {
					organizations: {
						type: 'schema',
						isRequired: true,
						isArray: true,
						options: {
							schema: {
								id: 'organization',
								version: 'v2020_07_22',
								namespace: 'Spruce',
								name: 'Organization',
								description:
									'A company or team. Comprises of many people and locations.',
								fields: {
									id: { label: 'Id', type: 'id', isRequired: true },
									name: { label: 'Name', type: 'text', isRequired: true },
									slug: { label: 'Slug', type: 'text', isRequired: true },
									dateCreated: { type: 'number', isRequired: true },
									dateDeleted: { type: 'number' },
								},
							},
						},
					},
				},
			},
		},
		'list-roles': {
			emitPayloadSchema: {
				id: 'listRolesTargetAndPayload',
				fields: {
					payload: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'listRolesEmitPayload',
								fields: { includePrivateRoles: { type: 'boolean' } },
							},
						},
					},
					target: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'eventTargetSchema',
								fields: {
									locationId: { type: 'id' },
									personId: { type: 'id' },
									organizationId: { type: 'id' },
								},
							},
						},
					},
				},
			},
			responsePayloadSchema: {
				id: 'listRolesResponsePayload',
				fields: {
					roles: {
						type: 'schema',
						isRequired: true,
						isArray: true,
						options: {
							schema: {
								id: 'role',
								version: 'v2020_07_22',
								namespace: 'Spruce',
								name: 'Role',
								description:
									'Every role in Spruce inherits from 5 bases. Owner, Group Manager, Manager, Teammate, and Guest.',
								fields: {
									id: { label: 'Id', type: 'id', isRequired: true },
									name: { label: 'Name', type: 'text', isRequired: true },
									base: {
										label: 'Base',
										type: 'select',
										hint:
											'Used to determine the default permissions when this role is created and the fallback for when a permission is not set on this role.',
										options: {
											choices: [
												{ label: 'Owner', value: 'owner' },
												{ label: 'Group manager', value: 'groupManager' },
												{ label: 'Manager', value: 'manager' },
												{ label: 'Teammate', value: 'teammate' },
												{ label: 'Guest', value: 'guest' },
												{ label: 'Anonymous', value: 'anonymous' },
											],
										},
									},
									description: { label: 'Description', type: 'text' },
									dateCreated: { type: 'number', isRequired: true },
									dateDeleted: { type: 'number' },
									organizationId: { type: 'id' },
									isPublic: {
										label: 'Public',
										type: 'boolean',
										hint:
											'Should I let people that are not part of this organization this role?',
									},
								},
							},
						},
					},
				},
			},
		},
		'register-events::v2020_12_25': {
			emitPayloadSchema: {
				id: 'registerEventsTargetAndPayload',
				fields: {
					payload: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'registerEventsEmitPayload',
								fields: {
									contract: {
										type: 'schema',
										isRequired: true,
										options: {
											schema: {
												id: 'eventContract',
												version: 'v2020_09_01',
												namespace: 'MercuryTypes',
												name: 'Event contract',
												fields: {
													eventSignatures: {
														type: 'schema',
														isRequired: true,
														options: {
															schema: {
																id: 'eventSignaturesByName',
																dynamicFieldSignature: {
																	keyName: 'eventName',
																	type: 'schema',
																	isRequired: true,
																	options: {
																		schema: {
																			id: 'eventSignature',
																			name: 'Event Signature',
																			description: '',
																			fields: {
																				responsePayloadSchema: {
																					type: 'raw',
																					options: {
																						valueType: 'SpruceSchema.ISchema',
																					},
																				},
																				emitPayloadSchema: {
																					type: 'raw',
																					options: {
																						valueType: 'SpruceSchema.ISchema',
																					},
																				},
																				listenPermissionContract: {
																					type: 'schema',
																					options: {
																						schemaId: {
																							id: 'permissionContract',
																							version: 'v2020_09_01',
																						},
																					},
																				},
																				emitPermissionContract: {
																					type: 'schema',
																					options: {
																						schemaId: {
																							id: 'permissionContract',
																							version: 'v2020_09_01',
																						},
																					},
																				},
																			},
																		},
																	},
																},
															},
														},
													},
												},
											},
										},
									},
								},
							},
						},
					},
				},
			},
			responsePayloadSchema: {
				id: 'registerEventsResponsePayload',
				fields: {},
			},
		},
		'register-listeners::v2020_12_25': {
			emitPayloadSchema: {
				id: 'registerListenersTargetAndPayload',
				fields: {
					payload: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'registerListenersEmitPayload',
								fields: {
									eventNamesWithOptionalNamespace: {
										type: 'text',
										isRequired: true,
										isArray: true,
									},
								},
							},
						},
					},
				},
			},
		},
		'register-skill::v2020_12_25': {
			emitPayloadSchema: {
				id: 'registerSkillTargetAndPayload',
				fields: {
					payload: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'registerSkillEmitPayload',
								fields: {
									name: { label: 'Name', type: 'text', isRequired: true },
									description: { label: 'Description', type: 'text' },
									slug: { label: 'Slug', type: 'text', isRequired: false },
								},
							},
						},
					},
				},
			},
			responsePayloadSchema: {
				id: 'registerSkillResponsePayload',
				fields: {
					skill: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'skill',
								version: 'v2020_07_22',
								namespace: 'Spruce',
								name: 'Skill',
								description: 'An ability Sprucebot has learned.',
								fields: {
									id: { label: 'Id', type: 'id', isRequired: true },
									apiKey: {
										label: 'Id',
										type: 'id',
										isPrivate: true,
										isRequired: true,
									},
									name: { label: 'Name', type: 'text', isRequired: true },
									description: { label: 'Description', type: 'text' },
									slug: { label: 'Slug', type: 'text', isRequired: true },
									creators: {
										label: 'Creators',
										type: 'schema',
										isPrivate: true,
										isRequired: true,
										hint:
											'The people or skills who created and own this skill.',
										isArray: true,
										options: {
											schema: {
												id: 'skillCreator',
												version: 'v2020_07_22',
												namespace: 'Spruce',
												name: 'Skill creator',
												fields: {
													skillId: { type: 'text' },
													personId: { type: 'text' },
												},
											},
										},
									},
									dateCreated: { type: 'number', isRequired: true },
									dateDeleted: { type: 'number' },
								},
							},
						},
					},
				},
			},
		},
		'request-pin::v2020_12_25': {
			emitPayloadSchema: {
				id: 'requestPinTargetAndPayload',
				fields: {
					payload: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'requestPinEmitPayload',
								fields: { phone: { type: 'phone', isRequired: true } },
							},
						},
					},
				},
			},
			responsePayloadSchema: {
				id: 'requestPinResponsePayload',
				fields: { challenge: { type: 'text', isRequired: true } },
			},
		},
		'scramble-account': {
			emitPayloadSchema: {
				id: 'scrambleAccountTargetAndPayload',
				fields: {
					payload: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: { id: 'scrambleAccountEmitPayload', fields: {} },
						},
					},
				},
			},
			responsePayloadSchema: {
				id: 'scrambleAccountResponsePayload',
				fields: {},
			},
		},
		'un-register-events': {
			emitPayloadSchema: {
				id: 'unRegisterEventsTargetAndPayload',
				fields: {
					payload: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'unRegisterEventsEmitPayload',
								fields: {
									eventNamesWithOptionalNamespace: {
										type: 'text',
										isRequired: true,
										isArray: true,
									},
								},
							},
						},
					},
				},
			},
			responsePayloadSchema: {
				id: 'unRegisterEventsResponsePayload',
				fields: {},
			},
		},
		'uninstall-skill': {
			emitPayloadSchema: {
				id: 'uninstallSkillTargetAndPayload',
				fields: {
					payload: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'unInstallSkillEmitPayload',
								fields: { skillId: { type: 'id', isRequired: true } },
							},
						},
					},
					target: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'eventTargetSchema',
								fields: {
									locationId: { type: 'id' },
									personId: { type: 'id' },
									organizationId: { type: 'id' },
								},
							},
						},
					},
				},
			},
			responsePayloadSchema: {
				id: 'unInstallSkillResponsePayload',
				fields: {},
			},
		},
		'update-location': {
			emitPayloadSchema: {
				id: 'updateLocationTargetAndPayload',
				fields: {
					payload: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'updateLocationEmitPayload',
								fields: {
									name: { label: 'Name', type: 'text', isRequired: false },
									num: {
										label: 'Store number',
										type: 'text',
										hint:
											'You can use other symbols, like # or dashes. #123 or 32-US-5',
										isRequired: false,
									},
									slug: { label: 'Slug', type: 'text', isRequired: false },
									isPublic: {
										label: 'Public',
										type: 'boolean',
										hint: 'Is this location viewable by guests?',
										defaultValue: false,
										isRequired: false,
									},
									phone: {
										label: 'Main Phone',
										type: 'phone',
										isRequired: false,
									},
									timezone: {
										label: 'Timezone',
										type: 'select',
										options: {
											choices: [
												{
													value: 'etc/gmt+12',
													label: 'International Date Line West',
												},
												{
													value: 'pacific/midway',
													label: 'Midway Island, Samoa',
												},
												{ value: 'pacific/honolulu', label: 'Hawaii' },
												{ value: 'us/alaska', label: 'Alaska' },
												{
													value: 'america/los_Angeles',
													label: 'Pacific Time (US & Canada)',
												},
												{
													value: 'america/tijuana',
													label: 'Tijuana, Baja California',
												},
												{ value: 'us/arizona', label: 'Arizona' },
												{
													value: 'america/chihuahua',
													label: 'Chihuahua, La Paz, Mazatlan',
												},
												{
													value: 'us/mountain',
													label: 'Mountain Time (US & Canada)',
												},
												{ value: 'america/managua', label: 'Central America' },
												{
													value: 'us/central',
													label: 'Central Time (US & Canada)',
												},
												{
													value: 'america/mexico_City',
													label: 'Guadalajara, Mexico City, Monterrey',
												},
												{ value: 'Canada/Saskatchewan', label: 'Saskatchewan' },
												{
													value: 'america/bogota',
													label: 'Bogota, Lima, Quito, Rio Branco',
												},
												{
													value: 'us/eastern',
													label: 'Eastern Time (US & Canada)',
												},
												{ value: 'us/east-indiana', label: 'Indiana (East)' },
												{
													value: 'Canada/atlantic',
													label: 'Atlantic Time (Canada)',
												},
												{ value: 'america/caracas', label: 'Caracas, La Paz' },
												{ value: 'america/manaus', label: 'Manaus' },
												{ value: 'america/Santiago', label: 'Santiago' },
												{ value: 'Canada/Newfoundland', label: 'Newfoundland' },
												{ value: 'america/Sao_Paulo', label: 'Brasilia' },
												{
													value: 'america/argentina/buenos_Aires',
													label: 'Buenos Aires, Georgetown',
												},
												{ value: 'america/godthab', label: 'Greenland' },
												{ value: 'america/montevideo', label: 'Montevideo' },
												{ value: 'america/Noronha', label: 'Mid-Atlantic' },
												{
													value: 'atlantic/cape_Verde',
													label: 'Cape Verde Is.',
												},
												{ value: 'atlantic/azores', label: 'Azores' },
												{
													value: 'africa/casablanca',
													label: 'Casablanca, Monrovia, Reykjavik',
												},
												{
													value: 'etc/gmt',
													label:
														'Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London',
												},
												{
													value: 'europe/amsterdam',
													label:
														'Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna',
												},
												{
													value: 'europe/belgrade',
													label:
														'Belgrade, Bratislava, Budapest, Ljubljana, Prague',
												},
												{
													value: 'europe/brussels',
													label: 'Brussels, Copenhagen, Madrid, Paris',
												},
												{
													value: 'europe/Sarajevo',
													label: 'Sarajevo, Skopje, Warsaw, Zagreb',
												},
												{ value: 'africa/lagos', label: 'West Central Africa' },
												{ value: 'asia/amman', label: 'Amman' },
												{
													value: 'europe/athens',
													label: 'Athens, Bucharest, Istanbul',
												},
												{ value: 'asia/beirut', label: 'Beirut' },
												{ value: 'africa/cairo', label: 'Cairo' },
												{ value: 'africa/Harare', label: 'Harare, Pretoria' },
												{
													value: 'europe/Helsinki',
													label:
														'Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius',
												},
												{ value: 'asia/Jerusalem', label: 'Jerusalem' },
												{ value: 'europe/minsk', label: 'Minsk' },
												{ value: 'africa/Windhoek', label: 'Windhoek' },
												{
													value: 'asia/Kuwait',
													label: 'Kuwait, Riyadh, Baghdad',
												},
												{
													value: 'europe/moscow',
													label: 'Moscow, St. Petersburg, Volgograd',
												},
												{ value: 'africa/Nairobi', label: 'Nairobi' },
												{ value: 'asia/tbilisi', label: 'Tbilisi' },
												{ value: 'asia/tehran', label: 'Tehran' },
												{ value: 'asia/muscat', label: 'Abu Dhabi, Muscat' },
												{ value: 'asia/baku', label: 'Baku' },
												{ value: 'asia/Yerevan', label: 'Yerevan' },
												{ value: 'asia/Kabul', label: 'Kabul' },
												{ value: 'asia/Yekaterinburg', label: 'Yekaterinburg' },
												{
													value: 'asia/Karachi',
													label: 'Islamabad, Karachi, Tashkent',
												},
												{
													value: 'asia/calcutta',
													label: 'Chennai, Kolkata, Mumbai, New Delhi',
												},
												{
													value: 'asia/calcutta',
													label: 'Sri Jayawardenapura',
												},
												{ value: 'asia/Katmandu', label: 'Kathmandu' },
												{ value: 'asia/almaty', label: 'Almaty, Novosibirsk' },
												{ value: 'asia/Dhaka', label: 'Astana, Dhaka' },
												{ value: 'asia/Rangoon', label: 'Yangon (Rangoon)' },
												{
													value: 'asia/bangkok',
													label: 'Bangkok, Hanoi, Jakarta',
												},
												{ value: 'asia/Krasnoyarsk', label: 'Krasnoyarsk' },
												{
													value: 'asia/Hong_Kong',
													label: 'Beijing, Chongqing, Hong Kong, Urumqi',
												},
												{
													value: 'asia/Kuala_Lumpur',
													label: 'Kuala Lumpur, Singapore',
												},
												{
													value: 'asia/Irkutsk',
													label: 'Irkutsk, Ulaan Bataar',
												},
												{ value: 'Australia/Perth', label: 'Perth' },
												{ value: 'asia/taipei', label: 'Taipei' },
												{ value: 'asia/tokyo', label: 'Osaka, Sapporo, Tokyo' },
												{ value: 'asia/Seoul', label: 'Seoul' },
												{ value: 'asia/Yakutsk', label: 'Yakutsk' },
												{ value: 'Australia/adelaide', label: 'Adelaide' },
												{ value: 'Australia/Darwin', label: 'Darwin' },
												{ value: 'Australia/brisbane', label: 'Brisbane' },
												{
													value: 'Australia/canberra',
													label: 'Canberra, Melbourne, Sydney',
												},
												{ value: 'Australia/Hobart', label: 'Hobart' },
												{ value: 'pacific/guam', label: 'Guam, Port Moresby' },
												{ value: 'asia/Vladivostok', label: 'Vladivostok' },
												{
													value: 'asia/magadan',
													label: 'Magadan, Solomon Is., New Caledonia',
												},
												{
													value: 'pacific/auckland',
													label: 'Auckland, Wellington',
												},
												{
													value: 'pacific/Fiji',
													label: 'Fiji, Kamchatka, Marshall Is.',
												},
												{ value: 'pacific/tongatapu', label: "Nuku'alofa" },
											],
										},
										isRequired: false,
									},
									address: {
										label: 'Address',
										type: 'address',
										isRequired: false,
									},
									dateCreated: { type: 'number', isRequired: false },
									dateDeleted: { type: 'number', isRequired: false },
									organizationId: { type: 'id', isRequired: false },
									id: { type: 'id', isRequired: true },
								},
							},
						},
					},
					target: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'eventTargetSchema',
								fields: {
									locationId: { type: 'id' },
									personId: { type: 'id' },
									organizationId: { type: 'id' },
								},
							},
						},
					},
				},
			},
			responsePayloadSchema: {
				id: 'updateLocationResponsePayload',
				fields: {
					location: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'location',
								version: 'v2020_07_22',
								namespace: 'Spruce',
								name: 'Location',
								description:
									'A physical location where people meet. An organization has at least one of them.',
								fields: {
									id: { label: 'Id', type: 'id', isRequired: true },
									name: { label: 'Name', type: 'text', isRequired: true },
									num: {
										label: 'Store number',
										type: 'text',
										hint:
											'You can use other symbols, like # or dashes. #123 or 32-US-5',
									},
									slug: { label: 'Slug', type: 'text', isRequired: true },
									isPublic: {
										label: 'Public',
										type: 'boolean',
										hint: 'Is this location viewable by guests?',
										defaultValue: false,
									},
									phone: { label: 'Main Phone', type: 'phone' },
									timezone: {
										label: 'Timezone',
										type: 'select',
										options: {
											choices: [
												{
													value: 'etc/gmt+12',
													label: 'International Date Line West',
												},
												{
													value: 'pacific/midway',
													label: 'Midway Island, Samoa',
												},
												{ value: 'pacific/honolulu', label: 'Hawaii' },
												{ value: 'us/alaska', label: 'Alaska' },
												{
													value: 'america/los_Angeles',
													label: 'Pacific Time (US & Canada)',
												},
												{
													value: 'america/tijuana',
													label: 'Tijuana, Baja California',
												},
												{ value: 'us/arizona', label: 'Arizona' },
												{
													value: 'america/chihuahua',
													label: 'Chihuahua, La Paz, Mazatlan',
												},
												{
													value: 'us/mountain',
													label: 'Mountain Time (US & Canada)',
												},
												{ value: 'america/managua', label: 'Central America' },
												{
													value: 'us/central',
													label: 'Central Time (US & Canada)',
												},
												{
													value: 'america/mexico_City',
													label: 'Guadalajara, Mexico City, Monterrey',
												},
												{ value: 'Canada/Saskatchewan', label: 'Saskatchewan' },
												{
													value: 'america/bogota',
													label: 'Bogota, Lima, Quito, Rio Branco',
												},
												{
													value: 'us/eastern',
													label: 'Eastern Time (US & Canada)',
												},
												{ value: 'us/east-indiana', label: 'Indiana (East)' },
												{
													value: 'Canada/atlantic',
													label: 'Atlantic Time (Canada)',
												},
												{ value: 'america/caracas', label: 'Caracas, La Paz' },
												{ value: 'america/manaus', label: 'Manaus' },
												{ value: 'america/Santiago', label: 'Santiago' },
												{ value: 'Canada/Newfoundland', label: 'Newfoundland' },
												{ value: 'america/Sao_Paulo', label: 'Brasilia' },
												{
													value: 'america/argentina/buenos_Aires',
													label: 'Buenos Aires, Georgetown',
												},
												{ value: 'america/godthab', label: 'Greenland' },
												{ value: 'america/montevideo', label: 'Montevideo' },
												{ value: 'america/Noronha', label: 'Mid-Atlantic' },
												{
													value: 'atlantic/cape_Verde',
													label: 'Cape Verde Is.',
												},
												{ value: 'atlantic/azores', label: 'Azores' },
												{
													value: 'africa/casablanca',
													label: 'Casablanca, Monrovia, Reykjavik',
												},
												{
													value: 'etc/gmt',
													label:
														'Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London',
												},
												{
													value: 'europe/amsterdam',
													label:
														'Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna',
												},
												{
													value: 'europe/belgrade',
													label:
														'Belgrade, Bratislava, Budapest, Ljubljana, Prague',
												},
												{
													value: 'europe/brussels',
													label: 'Brussels, Copenhagen, Madrid, Paris',
												},
												{
													value: 'europe/Sarajevo',
													label: 'Sarajevo, Skopje, Warsaw, Zagreb',
												},
												{ value: 'africa/lagos', label: 'West Central Africa' },
												{ value: 'asia/amman', label: 'Amman' },
												{
													value: 'europe/athens',
													label: 'Athens, Bucharest, Istanbul',
												},
												{ value: 'asia/beirut', label: 'Beirut' },
												{ value: 'africa/cairo', label: 'Cairo' },
												{ value: 'africa/Harare', label: 'Harare, Pretoria' },
												{
													value: 'europe/Helsinki',
													label:
														'Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius',
												},
												{ value: 'asia/Jerusalem', label: 'Jerusalem' },
												{ value: 'europe/minsk', label: 'Minsk' },
												{ value: 'africa/Windhoek', label: 'Windhoek' },
												{
													value: 'asia/Kuwait',
													label: 'Kuwait, Riyadh, Baghdad',
												},
												{
													value: 'europe/moscow',
													label: 'Moscow, St. Petersburg, Volgograd',
												},
												{ value: 'africa/Nairobi', label: 'Nairobi' },
												{ value: 'asia/tbilisi', label: 'Tbilisi' },
												{ value: 'asia/tehran', label: 'Tehran' },
												{ value: 'asia/muscat', label: 'Abu Dhabi, Muscat' },
												{ value: 'asia/baku', label: 'Baku' },
												{ value: 'asia/Yerevan', label: 'Yerevan' },
												{ value: 'asia/Kabul', label: 'Kabul' },
												{ value: 'asia/Yekaterinburg', label: 'Yekaterinburg' },
												{
													value: 'asia/Karachi',
													label: 'Islamabad, Karachi, Tashkent',
												},
												{
													value: 'asia/calcutta',
													label: 'Chennai, Kolkata, Mumbai, New Delhi',
												},
												{
													value: 'asia/calcutta',
													label: 'Sri Jayawardenapura',
												},
												{ value: 'asia/Katmandu', label: 'Kathmandu' },
												{ value: 'asia/almaty', label: 'Almaty, Novosibirsk' },
												{ value: 'asia/Dhaka', label: 'Astana, Dhaka' },
												{ value: 'asia/Rangoon', label: 'Yangon (Rangoon)' },
												{
													value: 'asia/bangkok',
													label: 'Bangkok, Hanoi, Jakarta',
												},
												{ value: 'asia/Krasnoyarsk', label: 'Krasnoyarsk' },
												{
													value: 'asia/Hong_Kong',
													label: 'Beijing, Chongqing, Hong Kong, Urumqi',
												},
												{
													value: 'asia/Kuala_Lumpur',
													label: 'Kuala Lumpur, Singapore',
												},
												{
													value: 'asia/Irkutsk',
													label: 'Irkutsk, Ulaan Bataar',
												},
												{ value: 'Australia/Perth', label: 'Perth' },
												{ value: 'asia/taipei', label: 'Taipei' },
												{ value: 'asia/tokyo', label: 'Osaka, Sapporo, Tokyo' },
												{ value: 'asia/Seoul', label: 'Seoul' },
												{ value: 'asia/Yakutsk', label: 'Yakutsk' },
												{ value: 'Australia/adelaide', label: 'Adelaide' },
												{ value: 'Australia/Darwin', label: 'Darwin' },
												{ value: 'Australia/brisbane', label: 'Brisbane' },
												{
													value: 'Australia/canberra',
													label: 'Canberra, Melbourne, Sydney',
												},
												{ value: 'Australia/Hobart', label: 'Hobart' },
												{ value: 'pacific/guam', label: 'Guam, Port Moresby' },
												{ value: 'asia/Vladivostok', label: 'Vladivostok' },
												{
													value: 'asia/magadan',
													label: 'Magadan, Solomon Is., New Caledonia',
												},
												{
													value: 'pacific/auckland',
													label: 'Auckland, Wellington',
												},
												{
													value: 'pacific/Fiji',
													label: 'Fiji, Kamchatka, Marshall Is.',
												},
												{ value: 'pacific/tongatapu', label: "Nuku'alofa" },
											],
										},
									},
									address: {
										label: 'Address',
										type: 'address',
										isRequired: true,
									},
									dateCreated: { type: 'number', isRequired: true },
									dateDeleted: { type: 'number' },
									organizationId: { type: 'id', isRequired: true },
								},
							},
						},
					},
				},
			},
		},
		'update-organization': {
			emitPayloadSchema: {
				id: 'updateOrganizationTargetAndPayload',
				fields: {
					payload: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'updateOrgWithoutSlugSchema',
								fields: {
									name: { label: 'Name', type: 'text', isRequired: false },
									dateCreated: { type: 'number', isRequired: false },
									dateDeleted: { type: 'number', isRequired: false },
								},
							},
						},
					},
					target: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'eventTargetSchema',
								fields: {
									locationId: { type: 'id' },
									personId: { type: 'id' },
									organizationId: { type: 'id' },
								},
							},
						},
					},
				},
			},
			responsePayloadSchema: {
				id: 'updateOrgResponsePayload',
				fields: {
					organization: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'updateOrg',
								fields: {
									name: { label: 'Name', type: 'text', isRequired: false },
									slug: { label: 'Slug', type: 'text', isRequired: false },
									dateCreated: { type: 'number', isRequired: false },
									dateDeleted: { type: 'number', isRequired: false },
								},
							},
						},
					},
				},
			},
		},
		'update-role': {
			emitPayloadSchema: {
				id: 'updateRoleTargetAndPayload',
				fields: {
					payload: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'updateRoleEmitPayload',
								fields: {
									name: { label: 'Name', type: 'text', isRequired: false },
									base: {
										label: 'Base',
										type: 'select',
										hint:
											'Used to determine the default permissions when this role is created and the fallback for when a permission is not set on this role.',
										options: {
											choices: [
												{ label: 'Owner', value: 'owner' },
												{ label: 'Group manager', value: 'groupManager' },
												{ label: 'Manager', value: 'manager' },
												{ label: 'Teammate', value: 'teammate' },
												{ label: 'Guest', value: 'guest' },
												{ label: 'Anonymous', value: 'anonymous' },
											],
										},
										isRequired: false,
									},
									description: {
										label: 'Description',
										type: 'text',
										isRequired: false,
									},
									dateDeleted: { type: 'number', isRequired: false },
									isPublic: {
										label: 'Public',
										type: 'boolean',
										hint:
											'Should I let people that are not part of this organization this role?',
										isRequired: false,
									},
									id: { type: 'id', isRequired: true },
								},
							},
						},
					},
					target: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'eventTargetSchema',
								fields: {
									locationId: { type: 'id' },
									personId: { type: 'id' },
									organizationId: { type: 'id' },
								},
							},
						},
					},
				},
			},
			responsePayloadSchema: {
				id: 'updateRoleResponsePayload',
				fields: {
					role: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'role',
								version: 'v2020_07_22',
								namespace: 'Spruce',
								name: 'Role',
								description:
									'Every role in Spruce inherits from 5 bases. Owner, Group Manager, Manager, Teammate, and Guest.',
								fields: {
									id: { label: 'Id', type: 'id', isRequired: true },
									name: { label: 'Name', type: 'text', isRequired: true },
									base: {
										label: 'Base',
										type: 'select',
										hint:
											'Used to determine the default permissions when this role is created and the fallback for when a permission is not set on this role.',
										options: {
											choices: [
												{ label: 'Owner', value: 'owner' },
												{ label: 'Group manager', value: 'groupManager' },
												{ label: 'Manager', value: 'manager' },
												{ label: 'Teammate', value: 'teammate' },
												{ label: 'Guest', value: 'guest' },
												{ label: 'Anonymous', value: 'anonymous' },
											],
										},
									},
									description: { label: 'Description', type: 'text' },
									dateCreated: { type: 'number', isRequired: true },
									dateDeleted: { type: 'number' },
									organizationId: { type: 'id' },
									isPublic: {
										label: 'Public',
										type: 'boolean',
										hint:
											'Should I let people that are not part of this organization this role?',
									},
								},
							},
						},
					},
				},
			},
		},
		'who-am-i': {
			emitPayloadSchema: {
				id: 'whoAmITargetAndPayload',
				fields: {
					payload: {
						type: 'schema',
						isRequired: true,
						options: { schema: { id: 'whoAmIEmitPayload', fields: {} } },
					},
				},
			},
			responsePayloadSchema: {
				id: 'authenticateResponsePayload',
				fields: {
					type: {
						type: 'select',
						isRequired: true,
						options: {
							choices: [
								{ value: 'authenticated', label: 'Authenticated' },
								{ value: 'anonymous', label: 'Anonymous' },
							],
						},
					},
					auth: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: {
								id: 'authSchema',
								fields: {
									person: {
										type: 'schema',
										options: {
											schema: {
												id: 'person',
												version: 'v2020_07_22',
												namespace: 'Spruce',
												name: 'Person',
												description: 'A human being.',
												fields: {
													id: { label: 'Id', type: 'id', isRequired: true },
													firstName: {
														label: 'First name',
														type: 'text',
														isPrivate: true,
													},
													lastName: {
														label: 'Last name',
														type: 'text',
														isPrivate: true,
													},
													casualName: {
														label: 'Casual name',
														type: 'text',
														isRequired: true,
														hint:
															'The name you can use when talking to this person.',
													},
													phone: {
														label: 'Phone',
														type: 'phone',
														isPrivate: true,
														hint: 'A number that can be texted',
													},
													profileImages: {
														label: 'Profile photos',
														type: 'schema',
														options: {
															schema: {
																id: 'profileImage',
																version: 'v2020_07_22',
																namespace: 'Spruce',
																name: 'Profile Image Sizes',
																description:
																	'Various sizes that a profile image comes in.',
																fields: {
																	profile60: {
																		label: '60x60',
																		type: 'text',
																		isRequired: true,
																	},
																	profile150: {
																		label: '150x150',
																		type: 'text',
																		isRequired: true,
																	},
																	'profile60@2x': {
																		label: '60x60',
																		type: 'text',
																		isRequired: true,
																	},
																	'profile150@2x': {
																		label: '150x150',
																		type: 'text',
																		isRequired: true,
																	},
																},
															},
														},
													},
													dateCreated: { type: 'number', isRequired: true },
													dateScrambled: { type: 'number' },
												},
											},
										},
									},
									skill: {
										type: 'schema',
										options: {
											schema: {
												id: 'skill',
												version: 'v2020_07_22',
												namespace: 'Spruce',
												name: 'Skill',
												description: 'An ability Sprucebot has learned.',
												fields: {
													id: { label: 'Id', type: 'id', isRequired: true },
													apiKey: {
														label: 'Id',
														type: 'id',
														isPrivate: true,
														isRequired: true,
													},
													name: {
														label: 'Name',
														type: 'text',
														isRequired: true,
													},
													description: { label: 'Description', type: 'text' },
													slug: {
														label: 'Slug',
														type: 'text',
														isRequired: true,
													},
													creators: {
														label: 'Creators',
														type: 'schema',
														isPrivate: true,
														isRequired: true,
														hint:
															'The people or skills who created and own this skill.',
														isArray: true,
														options: {
															schema: {
																id: 'skillCreator',
																version: 'v2020_07_22',
																namespace: 'Spruce',
																name: 'Skill creator',
																fields: {
																	skillId: { type: 'text' },
																	personId: { type: 'text' },
																},
															},
														},
													},
													dateCreated: { type: 'number', isRequired: true },
													dateDeleted: { type: 'number' },
												},
											},
										},
									},
								},
							},
						},
					},
				},
			},
		},
	},
})

export type TestEventContract = typeof testEventContract
