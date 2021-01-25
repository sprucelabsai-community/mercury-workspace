import {
	coreEventContracts,
	CoreEventContract,
} from '@sprucelabs/mercury-types'
import { eventResponseUtil } from '@sprucelabs/spruce-event-utils'
import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import { MercuryClientFactory } from '../..'
import { TEST_HOST } from '../../tests/constants'

export default class SimulatingEventsForTestingTest extends AbstractSpruceTest {
	private static clients: any[] = []

	protected static async beforeEach() {
		await super.beforeEach()
	}

	protected static async afterEach() {
		await super.afterEach()
		for (const client of this.clients) {
			await client.disconnect()
		}
		this.clients = []
	}

	@test()
	protected static testModeFalseByDefault() {
		assert.isFalse(MercuryClientFactory.isInTestMode())
	}

	@test()
	protected static async canSetTestMode() {
		MercuryClientFactory.setIsTestMode(true)
		assert.isTrue(MercuryClientFactory.isInTestMode())
	}

	private static readonly eventName = 'whoami::v2020_12_25'

	@test()
	protected static async testClientHasContracts() {
		const client = await this.connectToApi()

		assert.isTrue(client.handlesEvent(this.eventName))
		assert.isFalse(client.handlesEvent('taco-bravo'))

		await client.disconnect()
	}

	@test()
	protected static async canEmitEventToSelfForTesting() {
		const client = await this.connectToApi()
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

	private static async connectToApi() {
		MercuryClientFactory.setIsTestMode(true)

		const client = await MercuryClientFactory.Client<CoreEventContract>({
			host: TEST_HOST,
			contracts: coreEventContracts,
		})

		this.clients.push(client)

		return client
	}
}
