import {
	coreEventContracts,
	CoreEventContract,
	EventContract,
} from '@sprucelabs/mercury-types'
import { eventResponseUtil } from '@sprucelabs/spruce-event-utils'
import { errorAssertUtil } from '@sprucelabs/test-utils'
import { test, assert } from '@sprucelabs/test'
import { MercuryClientFactory } from '../..'
import AbstractClientTest from '../../tests/AbstractClientTest'
import { TEST_HOST } from '../../tests/constants'

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
		MercuryClientFactory.setIsTestMode(true)

		const { client: personClient } = await this.loginAsDemoPerson()

		const org = await this.seedDummyOrg(personClient)
		const {
			client: skill1Client,

			skill,
		} = await this.seedInstallAndLoginAsSkill(personClient, org)

		const { client: skill2Client } = await this.seedInstallAndLoginAsSkill(
			personClient,
			org
		)

		this.mixinPayloadlessTestEvent(personClient)

		let s: any

		//@ts-ignore
		await skill2Client.on(this.testEventName, ({ source }) => {
			s = source
		})

		//@ts-ignore
		await skill1Client.emit(this.testEventName)

		assert.isTruthy(s.skillId)
		assert.isEqual(s.skillId, skill.id)
		assert.isUndefined(s.personId)
	}

	private static async connectToApi(
		shouldSetDefaultContract = false,
		contract?: EventContract
	) {
		MercuryClientFactory.setIsTestMode(true)
		shouldSetDefaultContract &&
			MercuryClientFactory.setDefaultContract(coreEventContracts[0])

		const allContracts = []
		if (!shouldSetDefaultContract) {
			allContracts.push(...coreEventContracts)
		}

		if (contract) {
			allContracts.push(contract as any)
		}

		const client = await MercuryClientFactory.Client<CoreEventContract>({
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
