import { EventContract } from '@sprucelabs/mercury-types'
import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import { errorAssertUtil } from '@sprucelabs/test-utils'
import { MercuryClient, ConnectionOptions } from '../../client.types'
import MercuryClientFactory from '../../MercuryClientFactory'
import MercurySocketIoClient from '../../MercurySocketIoClient'
import MutableContractClient from '../../tests/MutableContractClient'
import {
	TestEventContract,
	testEventContract,
} from '../support/TestEventContract'
require('dotenv').config()

const TEST_HOST = process.env.TEST_HOST ?? 'https://localhost:8001'

type Organization = any

export default class MercuryClientTest extends AbstractSpruceTest {
	private static clients: MercuryClient<TestEventContract>[] = []
	private static dummySkillCount = 0

	protected static async afterEach() {
		await super.afterEach()
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
		const results = await client.emit('get-event-contracts')
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
		const client = await this.connect()

		assert.isTruthy(client instanceof MercurySocketIoClient)
		assert.isTrue(client.isConnected())

		await client.disconnect()

		assert.isFalse(client.isConnected())
	}

	private static async connect(options?: Partial<ConnectionOptions>) {
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
		const client = await this.connect()

		//@ts-ignore
		const err = await assert.doesThrowAsync(() => client.emit('health2'))

		errorAssertUtil.assertError(err, 'INVALID_EVENT_NAME')
	}

	@test()
	protected static async cantEmitEventWithWithUnexpectedPayload() {
		const client = await this.connect()
		const err = await assert.doesThrowAsync(() =>
			//@ts-ignore
			client.emit('health', { taco: 'bravo' })
		)

		errorAssertUtil.assertError(err, 'UNEXPECTED_PAYLOAD', {
			eventNameWithOptionalNamespace: 'health',
		})
	}

	@test()
	protected static async throwsHelpfulErrorWhenCantReachHost() {
		const host = 'https://wontfindthisanywhere.com'
		const err = await assert.doesThrowAsync(() => this.connect({ host }))
		errorAssertUtil.assertError(err, 'CONNECTION_FAILED', {
			host,
			statusCode: 503,
		})
	}

	@test()
	protected static async getsAccessDeniedWhenTryingToListenToUnknownEventAnonymously() {
		const client = await this.connect()
		const err = await assert.doesThrowAsync(() =>
			//@ts-ignore
			client.on('waka-waka', () => {})
		)

		errorAssertUtil.assertError(err, 'UNAUTHORIZED_ACCESS')
	}

	@test()
	protected static async cantEmitEventWithWithInvalidPayload() {
		const client = await this.connect()
		const err = await assert.doesThrowAsync(() =>
			//@ts-ignore
			client.emit('request-pin', {})
		)

		errorAssertUtil.assertError(err, 'INVALID_PAYLOAD', {
			eventNameWithOptionalNamespace: 'request-pin',
		})
	}

	@test()
	protected static async canRunHealthCheck() {
		const client = await this.connect()
		const results = await client.emit('health')

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
		await skill2Client.on(`${skill1.slug}.will-send-vip`, () => {
			newEventTriggered = true
			return {
				messages: ['hello world'],
			}
		})

		//@ts-ignore
		const results = await skill1Client.emit(`${skill1.slug}.will-send-vip`, {
			target: {
				organizationId: org.id,
			},
		})

		assert.isEqual(results.totalErrors, 0)
		assert.isTrue(newEventTriggered)
	}

	private static async setup2SkillsAndOneEvent() {
		const client = await this.connect()

		await this.signupDemoPerson(client)

		const org = await this.createDummyOrg(client)

		const {
			skill: skill1,
			skillClient: skill1Client,
		} = await this.createInstallAndLoginAsSkill(client, org)

		const {
			skillClient: skill2Client,
		} = await this.createInstallAndLoginAsSkill(client, org)

		MutableContractClient.mixinContract(
			this.generateWillSendVipEventSignature(skill1.slug)
		)

		const registerResults = await skill1Client.emit('register-events', {
			payload: {
				contract: this.generateWillSendVipEventSignature(),
			},
		})

		assert.isEqual(registerResults.totalErrors, 0)

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
		await skill2Client.on(`${skill1.slug}.will-send-vip`, () => {
			listenTriggerCount++
			return {
				messages: ['hello from skill 2'],
			}
		})

		//@ts-ignore
		await skill3Client.on(`${skill1.slug}.will-send-vip`, () => {
			listenTriggerCount++
			return {
				messages: ['hello from skill 3'],
			}
		})

		//@ts-ignore
		await skill4Client.on(`${skill1.slug}.will-send-vip`, () => {
			listenTriggerCount++
			return {
				messages: ['hello from skill 4'],
			}
		})

		let responseTriggerCount = 0

		await skill1Client.emit(
			//@ts-ignore
			`${skill1.slug}.will-send-vip`,
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

		const eventName = `${skill1.slug}.will-send-vip`

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
	protected static async serverSideErrorsMappedToSpruceErrors() {
		const client = await this.connect()
		const response = await client.emit('register-skill', {
			payload: { name: 'test' },
		})
		const errors = response.responses[0].errors

		assert.isTruthy(errors)
		errorAssertUtil.assertError(errors[0], 'UNAUTHORIZED_ACCESS')
	}

	private static generateWillSendVipEventSignature(
		slug?: string
	): EventContract {
		const contract: EventContract = {
			eventSignatures: {
				[`${slug ? `${slug}.` : ''}will-send-vip`]: {
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

		const skillClient = await this.connect({ isTest: true })
		const authResults = await skillClient.emit('authenticate', {
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
		const skill1Results = await client.emit('register-skill', {
			payload: {
				name: `Dummy skill ${this.dummySkillCount++} ${new Date().getTime()}`,
			},
		})

		const skill = skill1Results.responses[0].payload?.skill
		assert.isTruthy(skill)

		const installResults = await client.emit('install-skill', {
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
		const orgResults = await client.emit('create-organization', {
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
		const requestPinResults = await client.emit('request-pin', {
			payload: {
				phone: '555-123-4567',
			},
		})

		const challenge = requestPinResults.responses[0].payload?.challenge

		assert.isTruthy(challenge)

		const confirmPinResults = await client.emit('confirm-pin', {
			payload: {
				challenge,
				pin: '7777',
			},
		})

		const person = confirmPinResults.responses[0].payload?.person

		assert.isTruthy(person)

		return person
	}
}
