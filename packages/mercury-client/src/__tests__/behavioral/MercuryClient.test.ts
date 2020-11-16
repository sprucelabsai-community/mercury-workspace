import { MutableEventContract } from '@sprucelabs/mercury-types'
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
	protected static async throwsWhenMissingContracts() {
		let err = await assert.doesThrowAsync(() =>
			//@ts-ignore
			MercuryClientFactory.Client({})
		)
		errorAssertUtil.assertError(err, 'MISSING_PARAMETERS', {
			parameters: ['contracts'],
		})

		err = await assert.doesThrowAsync(() =>
			//@ts-ignore
			MercuryClientFactory.Client({ contracts: [] })
		)
		errorAssertUtil.assertError(err, 'INVALID_PARAMETERS', {
			parameters: ['contracts'],
		})
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

		errorAssertUtil.assertError(err, 'UNEXPECTED_PAYLOAD')
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
	protected static async cantListenToEventThatDoesNotExist() {
		const client = await this.connect()
		const err = await assert.doesThrowAsync(() =>
			//@ts-ignore
			client.on('waka-waka', () => {})
		)

		errorAssertUtil.assertError(err, 'INVALID_EVENT_NAME')
	}

	@test()
	protected static async cantEmitEventWithWithInvalidPayload() {
		const client = await this.connect()
		const err = await assert.doesThrowAsync(() =>
			//@ts-ignore
			client.emit('request-pin', {})
		)

		errorAssertUtil.assertError(err, 'INVALID_PAYLOAD')
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

	private static generateWillSendVipEventSignature(
		slug?: string
	): MutableEventContract {
		const contract: MutableEventContract = {
			eventSignatures: [
				{
					eventNameWithOptionalNamespace: `${
						slug ? `${slug}.` : ''
					}will-send-vip`,
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
			],
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
