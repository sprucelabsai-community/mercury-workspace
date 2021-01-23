import { EventContract } from '@sprucelabs/mercury-types'
import { eventResponseUtil } from '@sprucelabs/spruce-event-utils'
import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import { errorAssertUtil } from '@sprucelabs/test-utils'
import { MercuryClient, ConnectionOptions } from '../../client.types'
import MercuryClientFactory from '../../clients/MercuryClientFactory'
import MercurySocketIoClient from '../../clients/MercurySocketIoClient'
import MutableContractClient from '../../clients/MutableContractClient'
import SpruceError from '../../errors/SpruceError'
import { TEST_HOST } from '../../tests/constants'
import {
	TestEventContract,
	testEventContract,
} from '../support/TestEventContract'
require('dotenv').config()

type Organization = any

export default class MercuryClientTest extends AbstractSpruceTest {
	private static clients: MercuryClient<TestEventContract>[] = []
	private static dummySkillCount = 0
	private static timeoutClient?: any

	protected static async afterEach() {
		await super.afterEach()

		if (this.timeoutClient) {
			this.timeoutClient.socket = null
		}

		for (const client of this.clients) {
			await client.disconnect()
		}
	}

	@test()
	protected static async factoryCanCreateClient() {
		assert.isTruthy(MercuryClientFactory.Client)
	}

	@test()
	protected static async allowsEmptyContracts() {
		const client = await MercuryClientFactory.Client({ host: TEST_HOST })
		this.clients.push(client)
	}

	@test()
	protected static async canGetResponseWithoutTypesWithNoContract() {
		const client = await MercuryClientFactory.Client({ host: TEST_HOST })
		this.clients.push(client)

		const results = await client.emit('get-event-contracts::v2020_12_25')

		assert.isTruthy(results)
	}

	@test()
	protected static async canAddEmitPayloadToAnythingWithoutContract() {
		const client = await MercuryClientFactory.Client({ host: TEST_HOST })
		this.clients.push(client)

		//@ts-ignore
		const results = await client.emit('get-event-contracts::v2020_12_25', {
			//@ts-ignore
			payload: { hello: 'world' },
		})

		assert.isTruthy(results)
	}

	@test()
	protected static async connectingToBadProtocolThrows() {
		const err = await assert.doesThrowAsync(() =>
			MercuryClientFactory.Client({ host: 'aoeu://tasty.org', contracts: [] })
		)
		errorAssertUtil.assertError(err, 'INVALID_PROTOCOL')
	}

	@test()
	protected static async factoryReturnsSocketIoClient() {
		const client = await this.Client()

		assert.isTruthy(client instanceof MercurySocketIoClient)
		assert.isTrue(client.isConnected())

		await client.disconnect()

		assert.isFalse(client.isConnected())
	}

	private static async Client(options?: Partial<ConnectionOptions>) {
		const { host = TEST_HOST, ...rest } = options || {}

		const client = await MercuryClientFactory.Client<TestEventContract>({
			host,
			allowSelfSignedCrt: true,
			contracts: [testEventContract],
			...rest,
		})

		this.clients.push(client)

		return client
	}

	@test()
	protected static async throwsWithBadEventName() {
		const client = await this.Client()

		//@ts-ignore
		const err = await assert.doesThrowAsync(() => client.emit('health2'))

		errorAssertUtil.assertError(err, 'INVALID_EVENT_NAME')
	}

	@test()
	protected static async cantEmitEventWithWithUnexpectedPayload() {
		const client = await this.Client()
		const err = await assert.doesThrowAsync(() =>
			//@ts-ignore
			client.emit('health::v2020_12_25', { taco: 'bravo' })
		)

		errorAssertUtil.assertError(err, 'UNEXPECTED_PAYLOAD', {
			eventName: 'health',
		})
	}

	@test()
	protected static async throwsHelpfulErrorWhenCantReachHost() {
		const host = 'https://wontfindthisanywhere.com'
		const err = await assert.doesThrowAsync(() => this.Client({ host }))
		errorAssertUtil.assertError(err, 'CONNECTION_FAILED', {
			host,
			statusCode: 503,
		})
	}

	@test()
	protected static async getsAccessDeniedWhenTryingToListenToUnknownEventAnonymously() {
		const client = await this.Client()
		const err = await assert.doesThrowAsync(() =>
			//@ts-ignore
			client.on('waka-waka', () => {})
		)

		errorAssertUtil.assertError(err, 'UNAUTHORIZED_ACCESS')
	}

	@test()
	protected static async cantEmitEventWithWithInvalidPayload() {
		const client = await this.Client()
		const err = await assert.doesThrowAsync(() =>
			//@ts-ignore
			client.emit('request-pin::v2020_12_25', {})
		)

		errorAssertUtil.assertError(err, 'INVALID_PAYLOAD', {
			eventName: 'request-pin',
		})
	}

	@test()
	protected static async canRunHealthCheck() {
		const client = await this.Client()
		const results = await client.emit('health::v2020_12_25')

		assert.isEqualDeep(results.responses[0].payload, {
			skill: { status: 'passed' },
			mercury: { status: 'passed' },
		})

		await client.disconnect()
	}

	@test()
	protected static async skillsCanListenToEachOther() {
		const {
			org,
			skill1,
			skill1Client,
			skill2Client,
		} = await this.setup2SkillsAndOneEvent()

		let newEventTriggered = false

		//@ts-ignore
		await skill2Client.on(`${skill1.slug}.will-send-vip::v1`, () => {
			newEventTriggered = true
			return {
				messages: ['hello world'],
			}
		})

		const results = await skill1Client.emit(
			//@ts-ignore
			`${skill1.slug}.will-send-vip::v1`,
			{
				target: {
					organizationId: org.id,
				},
			}
		)

		assert.isEqual(results.totalErrors, 0)
		assert.isTrue(newEventTriggered)
	}

	private static async setup2SkillsAndOneEvent() {
		const client = await this.Client()

		await this.signupDemoPerson(client)

		const org = await this.createDummyOrg(client)

		const createLogin = this.createInstallAndLoginAsSkill(client, org)
		const createLogin2 = this.createInstallAndLoginAsSkill(client, org)

		const { skill: skill1, skillClient: skill1Client } = await createLogin

		const { skillClient: skill2Client } = await createLogin2

		MutableContractClient.mixinContract(
			this.generateWillSendVipEventSignature(skill1.slug)
		)

		const registerResults = await skill1Client.emit(
			'register-events::v2020_12_25',
			{
				payload: {
					contract: this.generateWillSendVipEventSignature(),
				},
			}
		)

		eventResponseUtil.getFirstResponseOrThrow(registerResults)

		return { client, org, skill1, skill1Client, skill2Client }
	}

	@test()
	protected static async emitterGetsCalledBackForEachListener() {
		const {
			client,
			org,
			skill1,
			skill1Client,
			skill2Client,
		} = await this.setup2SkillsAndOneEvent()

		const {
			skillClient: skill3Client,
		} = await this.createInstallAndLoginAsSkill(client, org)

		const {
			skillClient: skill4Client,
		} = await this.createInstallAndLoginAsSkill(client, org)

		let listenTriggerCount = 0

		//@ts-ignore
		await skill2Client.on(`${skill1.slug}.will-send-vip::v1`, () => {
			listenTriggerCount++
			return {
				messages: ['hello from skill 2'],
			}
		})

		//@ts-ignore
		await skill3Client.on(`${skill1.slug}.will-send-vip::v1`, () => {
			listenTriggerCount++
			return {
				messages: ['hello from skill 3'],
			}
		})

		//@ts-ignore
		await skill4Client.on(`${skill1.slug}.will-send-vip::v1`, () => {
			listenTriggerCount++
			return {
				messages: ['hello from skill 4'],
			}
		})

		let responseTriggerCount = 0

		await skill1Client.emit(
			//@ts-ignore
			`${skill1.slug}.will-send-vip::v1`,
			{
				target: {
					organizationId: org.id,
				},
			},
			() => {
				responseTriggerCount++
			}
		)

		assert.isEqual(listenTriggerCount, 3)
		assert.isEqual(responseTriggerCount, 3)
	}

	@test()
	protected static async offRemovesListener() {
		const {
			org,
			skill1,
			skill1Client,
			skill2Client,
		} = await this.setup2SkillsAndOneEvent()

		let listenerTriggerCount = 0

		const eventName = `${skill1.slug}.will-send-vip::v1`

		//@ts-ignore
		await skill2Client.on(eventName, () => {
			listenerTriggerCount++
			return {
				messages: ['hello world'],
			}
		})

		//@ts-ignore
		await skill1Client.emit(eventName, {
			target: {
				organizationId: org.id,
			},
		})

		//@ts-ignore
		const offCount = await skill2Client.off(eventName)
		assert.isEqual(offCount, 1)

		//@ts-ignore
		await skill1Client.emit(eventName, {
			target: {
				organizationId: org.id,
			},
		})

		assert.isEqual(listenerTriggerCount, 1)
	}

	@test()
	protected static async offErrorsWithUnknownEvent() {
		const { skill1Client } = await this.setup2SkillsAndOneEvent()

		const err = await assert.doesThrowAsync(() =>
			//@ts-ignore
			skill1Client.off('event-does-not-exist')
		)

		errorAssertUtil.assertError(err, 'INVALID_EVENT_NAME')
	}

	@test()
	protected static async throwsWhenEmittingWhenNotConnected() {
		const client = await this.Client()
		await client.disconnect()

		const err = await assert.doesThrowAsync(() =>
			client.emit('health::v2020_12_25')
		)

		errorAssertUtil.assertError(err, 'NOT_CONNECTED')
	}

	@test()
	protected static async serverSideErrorsMappedToSpruceErrors() {
		const client = await this.Client()
		const response = await client.emit('register-skill::v2020_12_25', {
			payload: { name: 'test' },
		})
		const errors = response.responses[0].errors

		assert.isTruthy(errors)
		errorAssertUtil.assertError(errors[0], 'UNAUTHORIZED_ACCESS')
	}

	@test()
	protected static async timesOutWhenEmittingEventThatIsNeverHandled() {
		const client = await this.TimeoutClient()

		const err = await assert.doesThrowAsync(() =>
			client.emit('register-skill::v2020_12_25', {
				payload: { name: 'test' },
			})
		)

		errorAssertUtil.assertError(err, 'TIMEOUT', {
			eventName: 'register-skill::v2020_12_25',
		})

		assert.isEqual(client.socket.invocationCounts.off, 1)
	}

	@test()
	protected static async timeoutMakesEventualResponseNotCount() {
		const client = await this.TimeoutClient(12000)

		const err = await assert.doesThrowAsync(() =>
			client.emit('register-skill::v2020_12_25', {
				payload: { name: 'test' },
			})
		)

		errorAssertUtil.assertError(err, 'TIMEOUT', {
			eventName: 'register-skill::v2020_12_25',
		})

		await this.wait(4000)

		assert.isEqual(client.socket.invocationCounts.off, 1)
	}

	@test()
	protected static async canRegisterEventsSimultaniously() {
		const client = await this.Client()
		await this.signupDemoPerson(client)

		const org = await this.createDummyOrg(client)

		const {
			skillClient: originalSkillClient,
		} = await this.createInstallAndLoginAsSkill(client, org)

		await Promise.all(
			new Array(5).fill(0).map(async () => {
				const { skill, skillClient } = await this.createInstallAndLoginAsSkill(
					client,
					org
				)

				const registerResults = await skillClient.emit(
					'register-events::v2020_12_25',
					{
						payload: {
							contract: this.generateWillSendVipEventSignature(),
						},
					}
				)

				eventResponseUtil.getFirstResponseOrThrow(registerResults)

				const results = await originalSkillClient.emit(
					'get-event-contracts::v2020_12_25'
				)

				const { contracts } = eventResponseUtil.getFirstResponseOrThrow(results)

				let found = false

				for (const contract of contracts) {
					if (contract.eventSignatures?.[`${skill.slug}.will-send-vip::v1`]) {
						found = true
						break
					}
				}

				assert.isTrue(found)
			})
		)

		const results = await originalSkillClient.emit(
			'get-event-contracts::v2020_12_25'
		)

		const { contracts } = eventResponseUtil.getFirstResponseOrThrow(results)

		assert.isLength(contracts, 5 + 1)
	}

	private static async TimeoutClient(emitDelay?: number): Promise<any> {
		const client = await this.Client({ emitTimeoutMs: 100 })

		//@ts-ignore
		const socket = client.socket as any

		await new Promise((resolve) => {
			socket?.once('disconnect', () => {
				socket?.removeAllListeners()
				resolve(undefined)
			})

			socket?.disconnect()
		})

		//@ts-ignore
		client.socket = {
			connected: true,
			invocationCounts: {
				off: 0,
			},
			emit: (_: any, __: any, cb: () => void) => {
				if (emitDelay && emitDelay > 0) {
					setTimeout(cb, emitDelay)
				}
			},
			on: () => {},
			off() {
				this.invocationCounts.off++
			},
			once: () => {},
			disconnect: () => {},
		}

		this.timeoutClient = client

		return client
	}

	private static generateWillSendVipEventSignature(
		slug?: string
	): EventContract {
		const contract: EventContract = {
			eventSignatures: {
				[`${slug ? `${slug}.` : ''}will-send-vip::v1`]: {
					emitPayloadSchema: {
						id: 'willSendVipTargetAndPayload',
						fields: {
							target: {
								type: 'schema',
								isRequired: true,
								options: {
									schema: {
										id: 'willSendVipTarget',
										fields: {
											organizationId: {
												type: 'text',
											},
										},
									},
								},
							},
						},
					},
					responsePayloadSchema: {
						id: 'testEventResponsePayload',
						fields: {
							messages: {
								type: 'text',
								isArray: true,
								isRequired: true,
							},
						},
					},
				},
			},
		}

		return contract
	}

	private static async createInstallAndLoginAsSkill(
		client: MercuryClient<TestEventContract>,
		org: Organization
	) {
		const skill = await this.createAndInstallDummySkill(client, org)

		const skillClient = await this.Client()
		const authResults = await skillClient.emit('authenticate::v2020_12_25', {
			payload: {
				skillId: skill.id,
				apiKey: skill.apiKey,
			},
		})

		assert.isEqual(authResults.totalErrors, 0)

		return { skill, skillClient }
	}

	private static async createAndInstallDummySkill(
		client: MercuryClient<TestEventContract>,
		org: Organization
	) {
		const skill1Results = await client.emit('register-skill::v2020_12_25', {
			payload: {
				name: `Dummy skill ${this.dummySkillCount++} ${new Date().getTime()}`,
			},
		})

		const skill = skill1Results.responses[0].payload?.skill
		assert.isTruthy(skill)

		const installResults = await client.emit('install-skill::v2020_12_25', {
			target: {
				organizationId: org.id,
			},
			payload: { skillId: skill.id },
		})

		assert.isEqual(installResults.totalErrors, 0)

		return skill
	}

	private static async createDummyOrg(
		client: MercuryClient<TestEventContract>
	) {
		const orgName = `Dummy org ${new Date().getTime()}`
		const orgResults = await client.emit('create-organization::v2020_12_25', {
			payload: {
				name: orgName,
			},
		})

		const org = orgResults.responses[0].payload?.organization

		assert.isTruthy(org)

		return org
	}

	private static async signupDemoPerson(
		client: MercuryClient<TestEventContract>
	) {
		const phone = process.env.DEMO_PHONE

		if (!phone) {
			throw new SpruceError({
				code: 'MISSING_PARAMETERS',
				parameters: ['env.DEMO_PHONE'],
			})
		}

		const requestPinResults = await client.emit('request-pin::v2020_12_25', {
			payload: {
				phone,
			},
		})

		const challenge = requestPinResults.responses[0].payload?.challenge

		assert.isTruthy(challenge)

		const confirmPinResults = await client.emit('confirm-pin::v2020_12_25', {
			payload: {
				challenge,
				pin: phone.substr(-4),
			},
		})

		const person = confirmPinResults.responses[0].payload?.person

		assert.isTruthy(person, 'Failed to login!')

		return person
	}
}
