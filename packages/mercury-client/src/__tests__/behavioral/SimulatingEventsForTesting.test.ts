import { coreEventContracts } from '@sprucelabs/mercury-core-events'
import {
	EventContract,
	buildPermissionContract,
} from '@sprucelabs/mercury-types'
import {
	buildEmitTargetAndPayloadSchema,
	eventAssertUtil,
	eventResponseUtil,
} from '@sprucelabs/spruce-event-utils'
import { test, assert } from '@sprucelabs/test'
import { errorAssertUtil } from '@sprucelabs/test-utils'
import { MercuryClientFactory } from '../..'
import SpruceError from '../../errors/SpruceError'
import AbstractClientTest from '../../tests/AbstractClientTest'
import {
	DEMO_PHONE_GUEST,
	DEMO_PHONE_TEAMMATE,
	TEST_HOST,
} from '../../tests/constants'
import { MercuryClient } from '../../types/client.types'

export default class SimulatingEventsForTestingTest extends AbstractClientTest {
	private static readonly eventName = 'whoami::v2020_12_25'
	private static readonly testEventName = 'my-skill.test-event::v2020_02_02'

	@test()
	protected static testModeFalseByDefault() {
		assert.isFalse(MercuryClientFactory.isInTestMode())
	}

	@test()
	protected static async canSetTestMode() {
		MercuryClientFactory.setIsTestMode(true)
		assert.isTrue(MercuryClientFactory.isInTestMode())
	}

	@test()
	protected static async testClientHandlesDefaultContracts() {
		const client = await this.connectToApi(true)

		assert.isTrue(client.doesHandleEvent(this.eventName))
		assert.isFalse(client.doesHandleEvent('taco-bravo'))

		await client.disconnect()
	}

	@test()
	protected static async canResetMixedInContracts() {
		const client = await this.connectToApi()

		assert.isFalse(client.doesHandleEvent(this.testEventName))
		assert.isTrue(client.doesHandleEvent(this.eventName))

		this.mixinPayloadlessTestEvent(client)

		assert.isTrue(client.doesHandleEvent(this.testEventName))
		assert.isTrue(client.doesHandleEvent(this.eventName))

		assert.doesThrow(() => this.mixinPayloadlessTestEvent(client))

		assert.isTrue(client.doesHandleEvent(this.testEventName))
		assert.isTrue(client.doesHandleEvent(this.eventName))

		client.resetContracts()

		assert.isFalse(client.doesHandleEvent(this.testEventName))
		assert.isTrue(client.doesHandleEvent(this.eventName))

		this.mixinPayloadlessTestEvent(client)

		assert.isTrue(client.doesHandleEvent(this.testEventName))
		assert.isTrue(client.doesHandleEvent(this.eventName))
	}

	@test('can emit to self with default contract', true)
	@test('can emit to self without default contract', false)
	protected static async canEmitEventToSelfForTesting(
		shouldSetDefaultContract: boolean
	) {
		const client = await this.connectToApi(shouldSetDefaultContract)
		let wasFired = false

		await client.on('did-message::v2020_12_25', async () => {
			wasFired = true
		})

		await client.emit('did-message::v2020_12_25', {
			target: {},
			payload: {
				message: {
					id: 'test',
					source: {},
					target: {},
					body: 'message body',
					classification: 'incoming',
					dateCreated: 1,
				},
			},
		})

		assert.isTrue(wasFired)
	}

	@test()
	protected static async canEmitToApiWhenNoLocalListenerIsSet() {
		const client = await this.connectToApi()
		const results = await client.emit('get-event-contracts::v2020_12_25')

		const { contracts } = eventResponseUtil.getFirstResponseOrThrow(results)

		assert.isArray(contracts)
		assert.isObject(contracts[0])
		assert.isObject(
			contracts[0].eventSignatures['get-event-contracts::v2020_12_25']
		)
	}

	@test()
	protected static async canHandleRapidFireConnectsToApi() {
		const client = await this.connectToApi()
		await Promise.all([
			client.emit('get-event-contracts::v2020_12_25'),
			client.emit('get-event-contracts::v2020_12_25'),
			client.emit('get-event-contracts::v2020_12_25'),
		])
	}

	@test()
	protected static async canEmitToSelfUsingToClients() {
		const [client1, client2] = await Promise.all([
			this.connectToApi(),
			this.connectToApi(),
		])

		let wasFired = false

		await client1.on('did-message::v2020_12_25', async () => {
			wasFired = true
		})

		await client2.emit('did-message::v2020_12_25', {
			target: {},
			payload: {
				message: {
					id: 'test',
					source: {},
					target: {},
					body: 'message body',
					classification: 'incoming',
					dateCreated: 1,
				},
			},
		})

		assert.isTrue(wasFired)
	}

	@test()
	protected static async factoryReturnsSocketIoClient() {
		const client = await this.connectToApi()

		assert.isTrue(client.isConnected())

		await client.disconnect()

		assert.isFalse(client.isConnected())
	}

	@test()
	protected static async canResetListeners() {
		MercuryClientFactory.resetTestClient()

		const client = await this.connectToApi()
		let fireCount = 0

		await client.on('did-message::v2020_12_25', async () => {
			fireCount++
		})

		await client.on('did-message::v2020_12_25', async () => {
			fireCount++
		})

		await client.emit('did-message::v2020_12_25', {
			target: {},
			payload: {
				message: {
					id: 'test',
					source: {},
					target: {},
					body: 'message body',
					classification: 'incoming',
					dateCreated: 1,
				},
			},
		})

		assert.isEqual(fireCount, 2)

		fireCount = 0

		MercuryClientFactory.resetTestClient()

		await client.on('did-message::v2020_12_25', async () => {
			fireCount++
		})

		await client.emit('did-message::v2020_12_25', {
			target: {},
			payload: {
				message: {
					id: 'test',
					source: {},
					target: {},
					body: 'message body',
					classification: 'incoming',
					dateCreated: 1,
				},
			},
		})

		assert.isEqual(fireCount, 1)
	}

	@test()
	protected static async canMixinContractsToTestClient() {
		const [client1, client2] = await Promise.all([
			this.connectToApi(),
			this.connectToApi(),
		])

		this.mixinPayloadlessTestEvent(client1)

		let hit = false

		//@ts-ignore
		await client2.on(this.testEventName, () => {
			hit = true
		})

		//@ts-ignore
		await client1.emit(this.testEventName)

		assert.isTruthy(hit)
	}

	@test()
	protected static async firstTestClientAddsEventToSecondTestClient() {
		const client1 = await this.connectToApi(false, {
			eventSignatures: {
				'my-new-event': {},
			},
		})
		const client2 = await this.connectToApi()

		assert.isTrue(client1.doesHandleEvent('my-new-event'))
		assert.isTrue(client2.doesHandleEvent('my-new-event'))
	}

	@test()
	protected static async secondTestClientAddsEventToFirstTestClient() {
		const client1 = await this.connectToApi()
		const client2 = await this.connectToApi(false, {
			eventSignatures: {
				'my-new-event': {},
			},
		})

		assert.isTrue(client1.doesHandleEvent('my-new-event'))
		assert.isTrue(client2.doesHandleEvent('my-new-event'))
	}

	@test()
	protected static async includesSourceInEventsEmittedByPerson() {
		const [client2, { client: client1, person }] = await Promise.all([
			this.connectToApi(),
			this.loginAsDemoPerson(),
		])

		this.mixinPayloadlessTestEvent(client1)

		let s: any

		//@ts-ignore
		await client2.on(this.testEventName, ({ source }) => {
			s = source
		})

		//@ts-ignore
		await client1.emit(this.testEventName)

		assert.isTruthy(s.personId)
		assert.isEqual(s.personId, person.id)
		assert.isUndefined(s.skillId)
	}

	@test()
	protected static async doesCheckPermsIfPermissionsIsEmptyArrayOnContract() {
		const [client2, { client: client1 }] = await Promise.all([
			this.connectToApi(),
			this.loginAsDemoPerson(),
		])

		const contract: EventContract = {
			eventSignatures: {
				[this.testEventName]: {
					emitPermissionContract: {
						id: 'test',
						name: 'Can emit',
						permissions: [],
					},
				},
			},
		}

		client2.mixinContract(contract)

		let s: any

		//@ts-ignore
		await client1.on(this.testEventName, ({ source }) => {
			s = source
		})

		//@ts-ignore
		const results = await client1.emit(this.testEventName)

		assert.isAbove(results.totalErrors, 0)
		assert.isFalsy(s)
	}

	@test()
	protected static async stillValidatesPayloads() {
		const [client1, client2] = await Promise.all([
			this.connectToApi(true),
			this.connectToApi(true),
		])

		let hit = false
		await client2.on('confirm-pin::v2020_12_25', async () => {
			hit = true
			return {
				token: 'yes!',
				person: {} as any,
			}
		})

		const err = await assert.doesThrowAsync(() =>
			client1.emit('confirm-pin::v2020_12_25', {
				//@ts-ignore
				fails: true,
			})
		)

		errorAssertUtil.assertError(err, 'INVALID_PAYLOAD')

		assert.isFalse(hit)
	}

	@test()
	protected static async includesSourceInEventsEmittedBySkill() {
		const { personClient, skill1Client, skill2Client, skill1 } =
			await this.setupOrgAndInstall2Skills()

		this.mixinPayloadlessTestEvent(personClient)

		let s: any

		//@ts-ignore
		await skill2Client.on(this.testEventName, ({ source }) => {
			s = source
		})

		//@ts-ignore
		await skill1Client.emit(this.testEventName)

		assert.isTruthy(s.skillId)
		assert.isEqual(s.skillId, skill1.id)
		assert.isUndefined(s.personId)
	}

	@test()
	protected static async checksPermissionsWhenEmitting() {
		const { skill1, skill1Client, skill2Client, org, personClient } =
			await this.setupOrgAndInstall2Skills()

		const eventName = 'event-with-emit-permissions::v2020_05_19'
		const fqen = `${skill1.slug}.event-with-emit-permissions::v2020_05_19`

		//@ts-ignore
		skill1Client.mixinContract({
			eventSignatures: {
				[fqen]: {
					emitPermissionContract: this.buildEmitPermContract(),
				},
			},
		})

		const registerEventResults = await skill1Client.emit(
			'register-events::v2020_12_25',
			{
				payload: {
					contract: {
						eventSignatures: {
							[eventName]: {
								emitPayloadSchema: buildEmitTargetAndPayloadSchema({
									eventName,
									targetSchema: {
										id: 'test-target',
										fields: {
											organizationId: {
												type: 'id',
												isRequired: true,
											},
										},
									},
								}),
								emitPermissionContract: this.buildEmitPermContract(),
							},
						},
					},
				},
			}
		)

		eventResponseUtil.getFirstResponseOrThrow(registerEventResults)

		await skill1Client.on(fqen as any, () => {
			return {}
		})

		await this.assertGuestCantEmit(fqen)
		await this.assertAnonCantEmit(fqen)
		await this.assertAnotherSkillCantEmit(fqen, skill2Client)
		await this.assertTeammateCanEmit({
			fqen,
			ownerClient: personClient,
			organizationId: org.id,
		})
	}

	@test()
	protected static async localResponsesAreValidated() {
		const [client1, client2] = await Promise.all([
			this.connectToApi(true),
			this.connectToApi(true),
		])

		//@ts-ignore
		await client2.on('confirm-pin::v2020_12_25', async () => {
			return {
				token: 'yes!',
				taco: {} as any,
			}
		})

		const results = await client1.emit('confirm-pin::v2020_12_25', {
			payload: {
				challenge: '1234',
				pin: '0000',
			},
		})

		assert.isEqual(results.totalErrors, 1)
		eventAssertUtil.assertErrorFromResponse(results, 'INVALID_RESPONSE_PAYLOAD')
	}

	@test()
	protected static async responsThrowingAnErrorIsPassedThrough() {
		const [client1, client2] = await Promise.all([
			this.connectToApi(true),
			this.connectToApi(true),
		])

		//@ts-ignore
		await client2.on('confirm-pin::v2020_12_25', async () => {
			//@ts-ignore
			throw new SpruceError({ code: 'TEST' })
		})

		const results = await client1.emit('confirm-pin::v2020_12_25', {
			payload: {
				challenge: '1234',
				pin: '0000',
			},
		})

		assert.isEqual(results.totalErrors, 1)
		eventAssertUtil.assertErrorFromResponse(results, 'TEST')
	}

	@test()
	protected static async testClientWrapsUnknownEventNameInHelpfulDebugError() {
		const client = await this.connectToApi(true)

		//@ts-ignore
		const err = await assert.doesThrowAsync(() => client.emit('waka-awka'))

		assert.doesInclude(err.message, 'spruce create.event')
	}

	@test()
	protected static async returnsHelpfulErrorIfEventExistsLocallyButNotRemotely() {
		const client = await this.connectToApi(true)

		//@ts-ignore
		client.eventContract = {
			eventSignatures: {
				['waka-waka']: {},
			},
		}

		//@ts-ignore
		const results = await client.emit('waka-waka')

		const err = eventAssertUtil.assertErrorFromResponse(
			results,
			'INVALID_EVENT_NAME'
		)

		assert.doesInclude(err.message, 'spruce listen.event')
	}

	@test()
	protected static async passesThroughProxyIfSetOnClient() {
		const { personClient, skill1Client, skill2Client, skill1 } =
			await this.setupOrgAndInstall2Skills()

		this.mixinPayloadlessTestEvent(personClient)

		let s: any

		//@ts-ignore
		await skill2Client.on(this.testEventName, ({ source }) => {
			s = source
		})

		const proxyToken = 'aoeuaoeuaoeu'
		skill1Client.setProxyToken(proxyToken)

		//@ts-ignore
		await skill1Client.emit(this.testEventName)

		assert.isTruthy(s.skillId)
		assert.isEqual(s.skillId, skill1.id)
		assert.isUndefined(s.personId)
		assert.isEqual(s.proxyToken, proxyToken)
	}

	@test()
	protected static async passesThroughProxyIfSentWithPayload() {
		const { personClient, skill1Client, skill2Client, skill1 } =
			await this.setupOrgAndInstall2Skills()

		this.mixinPayloadlessTestEvent(personClient)

		let s: any

		//@ts-ignore
		await skill2Client.on(this.testEventName, ({ source }) => {
			s = source
		})

		const proxyToken = 'aoeuaoeuaoeu'
		skill1Client.setProxyToken('this-should-be-ignored-now')

		//@ts-ignore
		await skill1Client.emit(this.testEventName, {
			source: {
				proxyToken,
			},
		})

		assert.isTruthy(s.skillId)
		assert.isEqual(s.skillId, skill1.id)
		assert.isUndefined(s.personId)
		assert.isEqual(s.proxyToken, proxyToken)
	}

	private static async assertTeammateCanEmit(options: {
		fqen: string
		ownerClient: MercuryClient
		organizationId: string
	}) {
		const { fqen, ownerClient, organizationId } = options

		const { person: teammate, client: teammateClient } =
			await this.loginAsDemoPerson(DEMO_PHONE_TEAMMATE)

		const roleResults = await ownerClient.emit('list-roles::v2020_12_25', {
			target: {
				organizationId,
			},
			payload: {
				shouldIncludePrivateRoles: true,
			},
		})

		const { roles } = eventResponseUtil.getFirstResponseOrThrow(roleResults)
		const teammateRole = roles.find((r) => r.base === 'teammate')
		assert.isTruthy(teammateRole)

		const roleSetResults = await ownerClient.emit('set-role::v2020_12_25', {
			target: {
				organizationId,
			},
			payload: {
				personId: teammate.id,
				roleId: teammateRole.id,
			},
		})
		eventResponseUtil.getFirstResponseOrThrow(roleSetResults)

		const response = await teammateClient.emit(fqen as any, {
			target: {
				organizationId,
			},
		})

		eventResponseUtil.getFirstResponseOrThrow(response)
	}

	private static async assertAnotherSkillCantEmit(
		fqen: string,
		skill2Client: any
	) {
		const results = await skill2Client.emit(fqen)
		eventAssertUtil.assertErrorFromResponse(results, 'UNAUTHORIZED_ACCESS')
	}

	private static async assertGuestCantEmit(fqen: string) {
		const { client: personClient } = await this.loginAsDemoPerson(
			DEMO_PHONE_GUEST
		)

		const response = await personClient.emit(fqen as any)

		eventAssertUtil.assertErrorFromResponse(response, 'UNAUTHORIZED_ACCESS')
	}

	private static async assertAnonCantEmit(fqen: string) {
		const client = await this.Client()

		const response = await client.emit(fqen as any)

		eventAssertUtil.assertErrorFromResponse(response, 'UNAUTHORIZED_ACCESS')
	}

	private static buildEmitPermContract() {
		return buildPermissionContract({
			name: 'Can emit contract',
			id: 'can-do-something-contract',
			permissions: [
				{
					id: 'can-create',
					name: 'Can create',
					defaults: {
						teammate: {
							default: true,
						},
					},
				},
			],
		})
	}

	private static async setupOrgAndInstall2Skills() {
		MercuryClientFactory.setIsTestMode(true)

		const { client: personClient } = await this.loginAsDemoPerson()

		const org = await this.seedDummyOrg(personClient)
		const { client: skill1Client, skill: skill1 } =
			await this.seedInstallAndLoginAsSkill(personClient, org)

		const { client: skill2Client } = await this.seedInstallAndLoginAsSkill(
			personClient,
			org
		)

		return { personClient, skill1, skill1Client, skill2Client, org }
	}

	private static async connectToApi(
		shouldSetDefaultContract = false,
		contract?: EventContract
	) {
		MercuryClientFactory.setIsTestMode(true)
		shouldSetDefaultContract &&
			MercuryClientFactory.setDefaultContract(coreEventContracts[0] as any)

		const allContracts = []
		if (!shouldSetDefaultContract) {
			allContracts.push(...coreEventContracts)
		}

		if (contract) {
			allContracts.push(contract as any)
		}

		const client = await MercuryClientFactory.Client({
			host: TEST_HOST,
			contracts: allContracts.length > 0 ? allContracts : undefined,
			allowSelfSignedCrt: true,
		})

		this.clients.push(client)

		return client
	}

	private static mixinPayloadlessTestEvent(client: any) {
		const contract = {
			eventSignatures: {
				[this.testEventName]: {},
			},
		}

		client.mixinContract(contract)
	}
}
