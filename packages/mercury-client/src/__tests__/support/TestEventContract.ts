export const testEventContract = {
	eventSignatures: [
		{
			eventNameWithOptionalNamespace: 'authenticate',
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
			emitPayloadSchema: {
				id: 'authenticateEmitPayload',
				fields: {
					token: { type: 'text', isRequired: false },
					skillId: { type: 'text', isRequired: false },
					apiKey: { type: 'text', isRequired: false },
				},
			},
		},
		{
			eventNameWithOptionalNamespace: 'can-listen',
			responsePayloadSchema: {
				id: 'canListenResponsePayload',
				fields: { can: { type: 'boolean' } },
			},
			emitPayloadSchema: {
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
					eventNameWithOptionalNamespace: { type: 'text', isRequired: true },
				},
			},
		},
		{
			eventNameWithOptionalNamespace: 'confirm-pin',
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
			emitPayloadSchema: {
				id: 'confirmPinEmitPayload',
				fields: {
					challenge: { type: 'text', isRequired: true },
					pin: { type: 'text', isRequired: true },
				},
			},
		},
		{
			eventNameWithOptionalNamespace: 'create-location',
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
												{
													value: 'america/managua',
													label: 'Central America',
												},
												{
													value: 'us/central',
													label: 'Central Time (US & Canada)',
												},
												{
													value: 'america/mexico_City',
													label: 'Guadalajara, Mexico City, Monterrey',
												},
												{
													value: 'Canada/Saskatchewan',
													label: 'Saskatchewan',
												},
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
												{
													value: 'america/caracas',
													label: 'Caracas, La Paz',
												},
												{ value: 'america/manaus', label: 'Manaus' },
												{ value: 'america/Santiago', label: 'Santiago' },
												{
													value: 'Canada/Newfoundland',
													label: 'Newfoundland',
												},
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
												{
													value: 'africa/lagos',
													label: 'West Central Africa',
												},
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
												{
													value: 'asia/Yekaterinburg',
													label: 'Yekaterinburg',
												},
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
												{
													value: 'asia/almaty',
													label: 'Almaty, Novosibirsk',
												},
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
												{
													value: 'asia/tokyo',
													label: 'Osaka, Sapporo, Tokyo',
												},
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
												{
													value: 'pacific/guam',
													label: 'Guam, Port Moresby',
												},
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
			emitPayloadSchema: {
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
								{ value: 'pacific/midway', label: 'Midway Island, Samoa' },
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
								{ value: 'us/central', label: 'Central Time (US & Canada)' },
								{
									value: 'america/mexico_City',
									label: 'Guadalajara, Mexico City, Monterrey',
								},
								{ value: 'Canada/Saskatchewan', label: 'Saskatchewan' },
								{
									value: 'america/bogota',
									label: 'Bogota, Lima, Quito, Rio Branco',
								},
								{ value: 'us/eastern', label: 'Eastern Time (US & Canada)' },
								{ value: 'us/east-indiana', label: 'Indiana (East)' },
								{ value: 'Canada/atlantic', label: 'Atlantic Time (Canada)' },
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
								{ value: 'atlantic/cape_Verde', label: 'Cape Verde Is.' },
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
									label: 'Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna',
								},
								{
									value: 'europe/belgrade',
									label: 'Belgrade, Bratislava, Budapest, Ljubljana, Prague',
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
									label: 'Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius',
								},
								{ value: 'asia/Jerusalem', label: 'Jerusalem' },
								{ value: 'europe/minsk', label: 'Minsk' },
								{ value: 'africa/Windhoek', label: 'Windhoek' },
								{ value: 'asia/Kuwait', label: 'Kuwait, Riyadh, Baghdad' },
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
								{ value: 'asia/calcutta', label: 'Sri Jayawardenapura' },
								{ value: 'asia/Katmandu', label: 'Kathmandu' },
								{ value: 'asia/almaty', label: 'Almaty, Novosibirsk' },
								{ value: 'asia/Dhaka', label: 'Astana, Dhaka' },
								{ value: 'asia/Rangoon', label: 'Yangon (Rangoon)' },
								{ value: 'asia/bangkok', label: 'Bangkok, Hanoi, Jakarta' },
								{ value: 'asia/Krasnoyarsk', label: 'Krasnoyarsk' },
								{
									value: 'asia/Hong_Kong',
									label: 'Beijing, Chongqing, Hong Kong, Urumqi',
								},
								{
									value: 'asia/Kuala_Lumpur',
									label: 'Kuala Lumpur, Singapore',
								},
								{ value: 'asia/Irkutsk', label: 'Irkutsk, Ulaan Bataar' },
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
								{ value: 'pacific/auckland', label: 'Auckland, Wellington' },
								{
									value: 'pacific/Fiji',
									label: 'Fiji, Kamchatka, Marshall Is.',
								},
								{ value: 'pacific/tongatapu', label: "Nuku'alofa" },
							],
						},
					},
					address: { label: 'Address', type: 'address', isRequired: true },
					dateDeleted: { type: 'number' },
					slug: { type: 'text', isRequired: false },
				},
			},
		},
		{
			eventNameWithOptionalNamespace: 'create-organization',
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
			emitPayloadSchema: {
				id: 'createOrgEmitPayload',
				fields: {
					name: { label: 'Name', type: 'text', isRequired: true },
					slug: { type: 'text', isRequired: false },
					dateDeleted: { type: 'number' },
				},
			},
		},
		{
			eventNameWithOptionalNamespace: 'create-role',
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
			emitPayloadSchema: {
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
		{
			eventNameWithOptionalNamespace: 'delete-location',
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
												{
													value: 'america/managua',
													label: 'Central America',
												},
												{
													value: 'us/central',
													label: 'Central Time (US & Canada)',
												},
												{
													value: 'america/mexico_City',
													label: 'Guadalajara, Mexico City, Monterrey',
												},
												{
													value: 'Canada/Saskatchewan',
													label: 'Saskatchewan',
												},
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
												{
													value: 'america/caracas',
													label: 'Caracas, La Paz',
												},
												{ value: 'america/manaus', label: 'Manaus' },
												{ value: 'america/Santiago', label: 'Santiago' },
												{
													value: 'Canada/Newfoundland',
													label: 'Newfoundland',
												},
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
												{
													value: 'africa/lagos',
													label: 'West Central Africa',
												},
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
												{
													value: 'asia/Yekaterinburg',
													label: 'Yekaterinburg',
												},
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
												{
													value: 'asia/almaty',
													label: 'Almaty, Novosibirsk',
												},
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
												{
													value: 'asia/tokyo',
													label: 'Osaka, Sapporo, Tokyo',
												},
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
												{
													value: 'pacific/guam',
													label: 'Guam, Port Moresby',
												},
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
			emitPayloadSchema: {
				id: 'deleteLocationEmitPayload',
				fields: { id: { type: 'id', isRequired: true } },
			},
		},
		{
			eventNameWithOptionalNamespace: 'delete-organization',
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
		{
			eventNameWithOptionalNamespace: 'delete-role',
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
			emitPayloadSchema: {
				id: 'deleteRoleEmitPayload',
				fields: {
					id: { type: 'id', isRequired: true },
					organizationId: { type: 'id' },
				},
			},
		},
		{
			eventNameWithOptionalNamespace: 'get-event-contracts',
			emitPayloadSchema: { id: 'getEventContractsEmitPayload', fields: {} },
		},
		{
			eventNameWithOptionalNamespace: 'get-location',
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
												{
													value: 'america/managua',
													label: 'Central America',
												},
												{
													value: 'us/central',
													label: 'Central Time (US & Canada)',
												},
												{
													value: 'america/mexico_City',
													label: 'Guadalajara, Mexico City, Monterrey',
												},
												{
													value: 'Canada/Saskatchewan',
													label: 'Saskatchewan',
												},
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
												{
													value: 'america/caracas',
													label: 'Caracas, La Paz',
												},
												{ value: 'america/manaus', label: 'Manaus' },
												{ value: 'america/Santiago', label: 'Santiago' },
												{
													value: 'Canada/Newfoundland',
													label: 'Newfoundland',
												},
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
												{
													value: 'africa/lagos',
													label: 'West Central Africa',
												},
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
												{
													value: 'asia/Yekaterinburg',
													label: 'Yekaterinburg',
												},
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
												{
													value: 'asia/almaty',
													label: 'Almaty, Novosibirsk',
												},
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
												{
													value: 'asia/tokyo',
													label: 'Osaka, Sapporo, Tokyo',
												},
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
												{
													value: 'pacific/guam',
													label: 'Guam, Port Moresby',
												},
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
			emitPayloadSchema: {
				id: 'getLocationEmitPayload',
				fields: { id: { type: 'id', isRequired: true } },
			},
		},
		{
			eventNameWithOptionalNamespace: 'get-organization',
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
		{
			eventNameWithOptionalNamespace: 'get-role',
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
			emitPayloadSchema: {
				id: 'getRoleEmitPayload',
				fields: { id: { type: 'id', isRequired: true } },
			},
		},
		{
			eventNameWithOptionalNamespace: 'health',
			responsePayloadSchema: {
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
			},
		},
		{
			eventNameWithOptionalNamespace: 'install-skill',
			responsePayloadSchema: {
				id: 'installSkillResponsePayload',
				fields: {},
			},
			emitPayloadSchema: {
				id: 'installSkillEmitPayload',
				fields: { skillId: { type: 'id', isRequired: true } },
			},
		},
		{
			eventNameWithOptionalNamespace: 'list-locations',
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
												{
													value: 'america/managua',
													label: 'Central America',
												},
												{
													value: 'us/central',
													label: 'Central Time (US & Canada)',
												},
												{
													value: 'america/mexico_City',
													label: 'Guadalajara, Mexico City, Monterrey',
												},
												{
													value: 'Canada/Saskatchewan',
													label: 'Saskatchewan',
												},
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
												{
													value: 'america/caracas',
													label: 'Caracas, La Paz',
												},
												{ value: 'america/manaus', label: 'Manaus' },
												{ value: 'america/Santiago', label: 'Santiago' },
												{
													value: 'Canada/Newfoundland',
													label: 'Newfoundland',
												},
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
												{
													value: 'africa/lagos',
													label: 'West Central Africa',
												},
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
												{
													value: 'asia/Yekaterinburg',
													label: 'Yekaterinburg',
												},
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
												{
													value: 'asia/almaty',
													label: 'Almaty, Novosibirsk',
												},
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
												{
													value: 'asia/tokyo',
													label: 'Osaka, Sapporo, Tokyo',
												},
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
												{
													value: 'pacific/guam',
													label: 'Guam, Port Moresby',
												},
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
			emitPayloadSchema: {
				id: 'listLocationsEmitPayload',
				fields: { includePrivateLocations: { type: 'boolean' } },
			},
		},
		{
			eventNameWithOptionalNamespace: 'list-organizations',
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
			emitPayloadSchema: { id: 'listOrgs', fields: {} },
		},
		{
			eventNameWithOptionalNamespace: 'list-roles',
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
			emitPayloadSchema: {
				id: 'listRolesEmitPayload',
				fields: { includePrivateRoles: { type: 'boolean' } },
			},
		},
		{
			eventNameWithOptionalNamespace: 'register-events',
			responsePayloadSchema: {
				id: 'registerEventsResponsePayload',
				fields: {},
			},
			emitPayloadSchema: {
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
										isArray: true,
										options: {
											schema: {
												id: 'eventSignature',
												version: 'v2020_09_01',
												namespace: 'MercuryTypes',
												name: 'Event Signature',
												fields: {
													eventNameWithOptionalNamespace: {
														type: 'text',
														isRequired: true,
													},
													responsePayloadSchema: {
														type: 'raw',
														options: { valueType: 'SpruceSchema.ISchema' },
													},
													emitPayloadSchema: {
														type: 'raw',
														options: { valueType: 'SpruceSchema.ISchema' },
													},
													listenPermissionContract: {
														type: 'schema',
														options: {
															schema: {
																id: 'permissionContract',
																version: 'v2020_09_01',
																namespace: 'MercuryTypes',
																name: 'Permission contract',
																fields: {
																	id: { type: 'text', isRequired: true },
																	name: {
																		label: 'Name',
																		type: 'text',
																		isRequired: true,
																		hint:
																			'Human readable name for this contract',
																	},
																	description: {
																		label: 'Description',
																		type: 'text',
																	},
																	requireAllPermissions: {
																		label: 'Require all permissions',
																		type: 'boolean',
																		defaultValue: false,
																	},
																	permissions: {
																		type: 'schema',
																		isRequired: true,
																		isArray: true,
																		options: {
																			schema: {
																				id: 'permission',
																				version: 'v2020_09_01',
																				namespace: 'MercuryTypes',
																				name: 'Permission',
																				fields: {
																					id: {
																						label: 'id',
																						type: 'text',
																						isRequired: true,
																						hint:
																							'Hyphen separated di for this permission, e.g. can-unlock-doors',
																					},
																					name: {
																						label: 'Name',
																						type: 'text',
																						isRequired: true,
																						hint:
																							'Human readable name for this permission',
																					},
																					description: {
																						label: 'Description',
																						type: 'text',
																					},
																					requireAllStatuses: {
																						label: 'Require all statuses',
																						type: 'boolean',
																						defaultValue: false,
																					},
																					defaultsByRoleBase: {
																						type: 'schema',
																						options: {
																							schema: {
																								id: 'defaultsByRole',
																								version: 'v2020_09_01',
																								namespace: 'MercuryTypes',
																								name: '',
																								fields: {
																									owner: {
																										label: 'Owner',
																										type: 'schema',
																										options: {
																											schema: {
																												id: 'statusFlags',
																												version: 'v2020_09_01',
																												namespace:
																													'MercuryTypes',
																												name: '',
																												fields: {
																													default: {
																														type: 'boolean',
																														hint:
																															'What is the fallback if no status is set?',
																													},
																													clockedIn: {
																														label: 'Clocked in',
																														type: 'boolean',
																														hint:
																															'Is the person clocked in and ready to rock?',
																													},
																													clockedOut: {
																														label:
																															'Clocked out',
																														type: 'boolean',
																														hint:
																															'When someone is not working (off the clock).',
																													},
																													onPrem: {
																														label: 'On premise',
																														type: 'boolean',
																														hint:
																															'Are they at work (maybe working, maybe visiting).',
																													},
																													offPrem: {
																														label:
																															'Off premise',
																														type: 'boolean',
																														hint:
																															"They aren't at the office or shop.",
																													},
																												},
																											},
																										},
																									},
																									groupManager: {
																										label: 'Group manager',
																										type: 'schema',
																										options: {
																											schema: {
																												id: 'statusFlags',
																												version: 'v2020_09_01',
																												namespace:
																													'MercuryTypes',
																												name: '',
																												fields: {
																													default: {
																														type: 'boolean',
																														hint:
																															'What is the fallback if no status is set?',
																													},
																													clockedIn: {
																														label: 'Clocked in',
																														type: 'boolean',
																														hint:
																															'Is the person clocked in and ready to rock?',
																													},
																													clockedOut: {
																														label:
																															'Clocked out',
																														type: 'boolean',
																														hint:
																															'When someone is not working (off the clock).',
																													},
																													onPrem: {
																														label: 'On premise',
																														type: 'boolean',
																														hint:
																															'Are they at work (maybe working, maybe visiting).',
																													},
																													offPrem: {
																														label:
																															'Off premise',
																														type: 'boolean',
																														hint:
																															"They aren't at the office or shop.",
																													},
																												},
																											},
																										},
																									},
																									manager: {
																										label: 'Manager',
																										type: 'schema',
																										options: {
																											schema: {
																												id: 'statusFlags',
																												version: 'v2020_09_01',
																												namespace:
																													'MercuryTypes',
																												name: '',
																												fields: {
																													default: {
																														type: 'boolean',
																														hint:
																															'What is the fallback if no status is set?',
																													},
																													clockedIn: {
																														label: 'Clocked in',
																														type: 'boolean',
																														hint:
																															'Is the person clocked in and ready to rock?',
																													},
																													clockedOut: {
																														label:
																															'Clocked out',
																														type: 'boolean',
																														hint:
																															'When someone is not working (off the clock).',
																													},
																													onPrem: {
																														label: 'On premise',
																														type: 'boolean',
																														hint:
																															'Are they at work (maybe working, maybe visiting).',
																													},
																													offPrem: {
																														label:
																															'Off premise',
																														type: 'boolean',
																														hint:
																															"They aren't at the office or shop.",
																													},
																												},
																											},
																										},
																									},
																									teammate: {
																										label: 'Teammate',
																										type: 'schema',
																										options: {
																											schema: {
																												id: 'statusFlags',
																												version: 'v2020_09_01',
																												namespace:
																													'MercuryTypes',
																												name: '',
																												fields: {
																													default: {
																														type: 'boolean',
																														hint:
																															'What is the fallback if no status is set?',
																													},
																													clockedIn: {
																														label: 'Clocked in',
																														type: 'boolean',
																														hint:
																															'Is the person clocked in and ready to rock?',
																													},
																													clockedOut: {
																														label:
																															'Clocked out',
																														type: 'boolean',
																														hint:
																															'When someone is not working (off the clock).',
																													},
																													onPrem: {
																														label: 'On premise',
																														type: 'boolean',
																														hint:
																															'Are they at work (maybe working, maybe visiting).',
																													},
																													offPrem: {
																														label:
																															'Off premise',
																														type: 'boolean',
																														hint:
																															"They aren't at the office or shop.",
																													},
																												},
																											},
																										},
																									},
																									guest: {
																										label: 'Guest',
																										type: 'schema',
																										options: {
																											schema: {
																												id: 'statusFlags',
																												version: 'v2020_09_01',
																												namespace:
																													'MercuryTypes',
																												name: '',
																												fields: {
																													default: {
																														type: 'boolean',
																														hint:
																															'What is the fallback if no status is set?',
																													},
																													clockedIn: {
																														label: 'Clocked in',
																														type: 'boolean',
																														hint:
																															'Is the person clocked in and ready to rock?',
																													},
																													clockedOut: {
																														label:
																															'Clocked out',
																														type: 'boolean',
																														hint:
																															'When someone is not working (off the clock).',
																													},
																													onPrem: {
																														label: 'On premise',
																														type: 'boolean',
																														hint:
																															'Are they at work (maybe working, maybe visiting).',
																													},
																													offPrem: {
																														label:
																															'Off premise',
																														type: 'boolean',
																														hint:
																															"They aren't at the office or shop.",
																													},
																												},
																											},
																										},
																									},
																									anonymous: {
																										label: 'Anonymous',
																										type: 'schema',
																										options: {
																											schema: {
																												id: 'statusFlags',
																												version: 'v2020_09_01',
																												namespace:
																													'MercuryTypes',
																												name: '',
																												fields: {
																													default: {
																														type: 'boolean',
																														hint:
																															'What is the fallback if no status is set?',
																													},
																													clockedIn: {
																														label: 'Clocked in',
																														type: 'boolean',
																														hint:
																															'Is the person clocked in and ready to rock?',
																													},
																													clockedOut: {
																														label:
																															'Clocked out',
																														type: 'boolean',
																														hint:
																															'When someone is not working (off the clock).',
																													},
																													onPrem: {
																														label: 'On premise',
																														type: 'boolean',
																														hint:
																															'Are they at work (maybe working, maybe visiting).',
																													},
																													offPrem: {
																														label:
																															'Off premise',
																														type: 'boolean',
																														hint:
																															"They aren't at the office or shop.",
																													},
																												},
																											},
																										},
																									},
																								},
																							},
																						},
																					},
																					can: {
																						type: 'schema',
																						options: {
																							schema: {
																								id: 'statusFlags',
																								version: 'v2020_09_01',
																								namespace: 'MercuryTypes',
																								name: '',
																								fields: {
																									default: {
																										type: 'boolean',
																										hint:
																											'What is the fallback if no status is set?',
																									},
																									clockedIn: {
																										label: 'Clocked in',
																										type: 'boolean',
																										hint:
																											'Is the person clocked in and ready to rock?',
																									},
																									clockedOut: {
																										label: 'Clocked out',
																										type: 'boolean',
																										hint:
																											'When someone is not working (off the clock).',
																									},
																									onPrem: {
																										label: 'On premise',
																										type: 'boolean',
																										hint:
																											'Are they at work (maybe working, maybe visiting).',
																									},
																									offPrem: {
																										label: 'Off premise',
																										type: 'boolean',
																										hint:
																											"They aren't at the office or shop.",
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
													emitPermissionContract: {
														type: 'schema',
														options: {
															schema: {
																id: 'permissionContract',
																version: 'v2020_09_01',
																namespace: 'MercuryTypes',
																name: 'Permission contract',
																fields: {
																	id: { type: 'text', isRequired: true },
																	name: {
																		label: 'Name',
																		type: 'text',
																		isRequired: true,
																		hint:
																			'Human readable name for this contract',
																	},
																	description: {
																		label: 'Description',
																		type: 'text',
																	},
																	requireAllPermissions: {
																		label: 'Require all permissions',
																		type: 'boolean',
																		defaultValue: false,
																	},
																	permissions: {
																		type: 'schema',
																		isRequired: true,
																		isArray: true,
																		options: {
																			schema: {
																				id: 'permission',
																				version: 'v2020_09_01',
																				namespace: 'MercuryTypes',
																				name: 'Permission',
																				fields: {
																					id: {
																						label: 'id',
																						type: 'text',
																						isRequired: true,
																						hint:
																							'Hyphen separated di for this permission, e.g. can-unlock-doors',
																					},
																					name: {
																						label: 'Name',
																						type: 'text',
																						isRequired: true,
																						hint:
																							'Human readable name for this permission',
																					},
																					description: {
																						label: 'Description',
																						type: 'text',
																					},
																					requireAllStatuses: {
																						label: 'Require all statuses',
																						type: 'boolean',
																						defaultValue: false,
																					},
																					defaultsByRoleBase: {
																						type: 'schema',
																						options: {
																							schema: {
																								id: 'defaultsByRole',
																								version: 'v2020_09_01',
																								namespace: 'MercuryTypes',
																								name: '',
																								fields: {
																									owner: {
																										label: 'Owner',
																										type: 'schema',
																										options: {
																											schema: {
																												id: 'statusFlags',
																												version: 'v2020_09_01',
																												namespace:
																													'MercuryTypes',
																												name: '',
																												fields: {
																													default: {
																														type: 'boolean',
																														hint:
																															'What is the fallback if no status is set?',
																													},
																													clockedIn: {
																														label: 'Clocked in',
																														type: 'boolean',
																														hint:
																															'Is the person clocked in and ready to rock?',
																													},
																													clockedOut: {
																														label:
																															'Clocked out',
																														type: 'boolean',
																														hint:
																															'When someone is not working (off the clock).',
																													},
																													onPrem: {
																														label: 'On premise',
																														type: 'boolean',
																														hint:
																															'Are they at work (maybe working, maybe visiting).',
																													},
																													offPrem: {
																														label:
																															'Off premise',
																														type: 'boolean',
																														hint:
																															"They aren't at the office or shop.",
																													},
																												},
																											},
																										},
																									},
																									groupManager: {
																										label: 'Group manager',
																										type: 'schema',
																										options: {
																											schema: {
																												id: 'statusFlags',
																												version: 'v2020_09_01',
																												namespace:
																													'MercuryTypes',
																												name: '',
																												fields: {
																													default: {
																														type: 'boolean',
																														hint:
																															'What is the fallback if no status is set?',
																													},
																													clockedIn: {
																														label: 'Clocked in',
																														type: 'boolean',
																														hint:
																															'Is the person clocked in and ready to rock?',
																													},
																													clockedOut: {
																														label:
																															'Clocked out',
																														type: 'boolean',
																														hint:
																															'When someone is not working (off the clock).',
																													},
																													onPrem: {
																														label: 'On premise',
																														type: 'boolean',
																														hint:
																															'Are they at work (maybe working, maybe visiting).',
																													},
																													offPrem: {
																														label:
																															'Off premise',
																														type: 'boolean',
																														hint:
																															"They aren't at the office or shop.",
																													},
																												},
																											},
																										},
																									},
																									manager: {
																										label: 'Manager',
																										type: 'schema',
																										options: {
																											schema: {
																												id: 'statusFlags',
																												version: 'v2020_09_01',
																												namespace:
																													'MercuryTypes',
																												name: '',
																												fields: {
																													default: {
																														type: 'boolean',
																														hint:
																															'What is the fallback if no status is set?',
																													},
																													clockedIn: {
																														label: 'Clocked in',
																														type: 'boolean',
																														hint:
																															'Is the person clocked in and ready to rock?',
																													},
																													clockedOut: {
																														label:
																															'Clocked out',
																														type: 'boolean',
																														hint:
																															'When someone is not working (off the clock).',
																													},
																													onPrem: {
																														label: 'On premise',
																														type: 'boolean',
																														hint:
																															'Are they at work (maybe working, maybe visiting).',
																													},
																													offPrem: {
																														label:
																															'Off premise',
																														type: 'boolean',
																														hint:
																															"They aren't at the office or shop.",
																													},
																												},
																											},
																										},
																									},
																									teammate: {
																										label: 'Teammate',
																										type: 'schema',
																										options: {
																											schema: {
																												id: 'statusFlags',
																												version: 'v2020_09_01',
																												namespace:
																													'MercuryTypes',
																												name: '',
																												fields: {
																													default: {
																														type: 'boolean',
																														hint:
																															'What is the fallback if no status is set?',
																													},
																													clockedIn: {
																														label: 'Clocked in',
																														type: 'boolean',
																														hint:
																															'Is the person clocked in and ready to rock?',
																													},
																													clockedOut: {
																														label:
																															'Clocked out',
																														type: 'boolean',
																														hint:
																															'When someone is not working (off the clock).',
																													},
																													onPrem: {
																														label: 'On premise',
																														type: 'boolean',
																														hint:
																															'Are they at work (maybe working, maybe visiting).',
																													},
																													offPrem: {
																														label:
																															'Off premise',
																														type: 'boolean',
																														hint:
																															"They aren't at the office or shop.",
																													},
																												},
																											},
																										},
																									},
																									guest: {
																										label: 'Guest',
																										type: 'schema',
																										options: {
																											schema: {
																												id: 'statusFlags',
																												version: 'v2020_09_01',
																												namespace:
																													'MercuryTypes',
																												name: '',
																												fields: {
																													default: {
																														type: 'boolean',
																														hint:
																															'What is the fallback if no status is set?',
																													},
																													clockedIn: {
																														label: 'Clocked in',
																														type: 'boolean',
																														hint:
																															'Is the person clocked in and ready to rock?',
																													},
																													clockedOut: {
																														label:
																															'Clocked out',
																														type: 'boolean',
																														hint:
																															'When someone is not working (off the clock).',
																													},
																													onPrem: {
																														label: 'On premise',
																														type: 'boolean',
																														hint:
																															'Are they at work (maybe working, maybe visiting).',
																													},
																													offPrem: {
																														label:
																															'Off premise',
																														type: 'boolean',
																														hint:
																															"They aren't at the office or shop.",
																													},
																												},
																											},
																										},
																									},
																									anonymous: {
																										label: 'Anonymous',
																										type: 'schema',
																										options: {
																											schema: {
																												id: 'statusFlags',
																												version: 'v2020_09_01',
																												namespace:
																													'MercuryTypes',
																												name: '',
																												fields: {
																													default: {
																														type: 'boolean',
																														hint:
																															'What is the fallback if no status is set?',
																													},
																													clockedIn: {
																														label: 'Clocked in',
																														type: 'boolean',
																														hint:
																															'Is the person clocked in and ready to rock?',
																													},
																													clockedOut: {
																														label:
																															'Clocked out',
																														type: 'boolean',
																														hint:
																															'When someone is not working (off the clock).',
																													},
																													onPrem: {
																														label: 'On premise',
																														type: 'boolean',
																														hint:
																															'Are they at work (maybe working, maybe visiting).',
																													},
																													offPrem: {
																														label:
																															'Off premise',
																														type: 'boolean',
																														hint:
																															"They aren't at the office or shop.",
																													},
																												},
																											},
																										},
																									},
																								},
																							},
																						},
																					},
																					can: {
																						type: 'schema',
																						options: {
																							schema: {
																								id: 'statusFlags',
																								version: 'v2020_09_01',
																								namespace: 'MercuryTypes',
																								name: '',
																								fields: {
																									default: {
																										type: 'boolean',
																										hint:
																											'What is the fallback if no status is set?',
																									},
																									clockedIn: {
																										label: 'Clocked in',
																										type: 'boolean',
																										hint:
																											'Is the person clocked in and ready to rock?',
																									},
																									clockedOut: {
																										label: 'Clocked out',
																										type: 'boolean',
																										hint:
																											'When someone is not working (off the clock).',
																									},
																									onPrem: {
																										label: 'On premise',
																										type: 'boolean',
																										hint:
																											'Are they at work (maybe working, maybe visiting).',
																									},
																									offPrem: {
																										label: 'Off premise',
																										type: 'boolean',
																										hint:
																											"They aren't at the office or shop.",
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
					},
				},
			},
		},
		{
			eventNameWithOptionalNamespace: 'register-listeners',
			emitPayloadSchema: {
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
		{
			eventNameWithOptionalNamespace: 'register-skill',
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
			emitPayloadSchema: {
				id: 'registerSkillEmitPayload',
				fields: {
					name: { label: 'Name', type: 'text', isRequired: true },
					description: { label: 'Description', type: 'text' },
					slug: { label: 'Slug', type: 'text', isRequired: false },
				},
			},
		},
		{
			eventNameWithOptionalNamespace: 'request-pin',
			responsePayloadSchema: {
				id: 'requestPinResponsePayload',
				fields: { challenge: { type: 'text', isRequired: true } },
			},
			emitPayloadSchema: {
				id: 'requestPinEmitPayload',
				fields: { phone: { type: 'phone', isRequired: true } },
			},
		},
		{
			eventNameWithOptionalNamespace: 'scramble-account',
			responsePayloadSchema: {
				id: 'scrambleAccountResponsePayload',
				fields: {},
			},
			emitPayloadSchema: { id: 'scrambleAccountEmitPayload', fields: {} },
		},
		{
			eventNameWithOptionalNamespace: 'un-register-events',
			responsePayloadSchema: {
				id: 'unRegisterEventsResponsePayload',
				fields: {},
			},
			emitPayloadSchema: {
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
		{
			eventNameWithOptionalNamespace: 'uninstall-skill',
			responsePayloadSchema: {
				id: 'unInstallSkillResponsePayload',
				fields: {},
			},
			emitPayloadSchema: {
				id: 'unInstallSkillEmitPayload',
				fields: { skillId: { type: 'id', isRequired: true } },
			},
		},
		{
			eventNameWithOptionalNamespace: 'update-location',
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
												{
													value: 'america/managua',
													label: 'Central America',
												},
												{
													value: 'us/central',
													label: 'Central Time (US & Canada)',
												},
												{
													value: 'america/mexico_City',
													label: 'Guadalajara, Mexico City, Monterrey',
												},
												{
													value: 'Canada/Saskatchewan',
													label: 'Saskatchewan',
												},
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
												{
													value: 'america/caracas',
													label: 'Caracas, La Paz',
												},
												{ value: 'america/manaus', label: 'Manaus' },
												{ value: 'america/Santiago', label: 'Santiago' },
												{
													value: 'Canada/Newfoundland',
													label: 'Newfoundland',
												},
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
												{
													value: 'africa/lagos',
													label: 'West Central Africa',
												},
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
												{
													value: 'asia/Yekaterinburg',
													label: 'Yekaterinburg',
												},
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
												{
													value: 'asia/almaty',
													label: 'Almaty, Novosibirsk',
												},
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
												{
													value: 'asia/tokyo',
													label: 'Osaka, Sapporo, Tokyo',
												},
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
												{
													value: 'pacific/guam',
													label: 'Guam, Port Moresby',
												},
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
			emitPayloadSchema: {
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
					phone: { label: 'Main Phone', type: 'phone', isRequired: false },
					timezone: {
						label: 'Timezone',
						type: 'select',
						options: {
							choices: [
								{
									value: 'etc/gmt+12',
									label: 'International Date Line West',
								},
								{ value: 'pacific/midway', label: 'Midway Island, Samoa' },
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
								{ value: 'us/central', label: 'Central Time (US & Canada)' },
								{
									value: 'america/mexico_City',
									label: 'Guadalajara, Mexico City, Monterrey',
								},
								{ value: 'Canada/Saskatchewan', label: 'Saskatchewan' },
								{
									value: 'america/bogota',
									label: 'Bogota, Lima, Quito, Rio Branco',
								},
								{ value: 'us/eastern', label: 'Eastern Time (US & Canada)' },
								{ value: 'us/east-indiana', label: 'Indiana (East)' },
								{ value: 'Canada/atlantic', label: 'Atlantic Time (Canada)' },
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
								{ value: 'atlantic/cape_Verde', label: 'Cape Verde Is.' },
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
									label: 'Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna',
								},
								{
									value: 'europe/belgrade',
									label: 'Belgrade, Bratislava, Budapest, Ljubljana, Prague',
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
									label: 'Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius',
								},
								{ value: 'asia/Jerusalem', label: 'Jerusalem' },
								{ value: 'europe/minsk', label: 'Minsk' },
								{ value: 'africa/Windhoek', label: 'Windhoek' },
								{ value: 'asia/Kuwait', label: 'Kuwait, Riyadh, Baghdad' },
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
								{ value: 'asia/calcutta', label: 'Sri Jayawardenapura' },
								{ value: 'asia/Katmandu', label: 'Kathmandu' },
								{ value: 'asia/almaty', label: 'Almaty, Novosibirsk' },
								{ value: 'asia/Dhaka', label: 'Astana, Dhaka' },
								{ value: 'asia/Rangoon', label: 'Yangon (Rangoon)' },
								{ value: 'asia/bangkok', label: 'Bangkok, Hanoi, Jakarta' },
								{ value: 'asia/Krasnoyarsk', label: 'Krasnoyarsk' },
								{
									value: 'asia/Hong_Kong',
									label: 'Beijing, Chongqing, Hong Kong, Urumqi',
								},
								{
									value: 'asia/Kuala_Lumpur',
									label: 'Kuala Lumpur, Singapore',
								},
								{ value: 'asia/Irkutsk', label: 'Irkutsk, Ulaan Bataar' },
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
								{ value: 'pacific/auckland', label: 'Auckland, Wellington' },
								{
									value: 'pacific/Fiji',
									label: 'Fiji, Kamchatka, Marshall Is.',
								},
								{ value: 'pacific/tongatapu', label: "Nuku'alofa" },
							],
						},
						isRequired: false,
					},
					address: { label: 'Address', type: 'address', isRequired: false },
					dateCreated: { type: 'number', isRequired: false },
					dateDeleted: { type: 'number', isRequired: false },
					organizationId: { type: 'id', isRequired: false },
					id: { type: 'id', isRequired: true },
				},
			},
		},
		{
			eventNameWithOptionalNamespace: 'update-organization',
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
			emitPayloadSchema: {
				id: 'updateOrgWithoutSlugSchema',
				fields: {
					name: { label: 'Name', type: 'text', isRequired: false },
					dateCreated: { type: 'number', isRequired: false },
					dateDeleted: { type: 'number', isRequired: false },
				},
			},
		},
		{
			eventNameWithOptionalNamespace: 'update-role',
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
			emitPayloadSchema: {
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
		{
			eventNameWithOptionalNamespace: 'who-am-i',
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
			emitPayloadSchema: { id: 'whoAmIEmitPayload', fields: {} },
		},
	],
} as const

export type TestEventContract = typeof testEventContract
