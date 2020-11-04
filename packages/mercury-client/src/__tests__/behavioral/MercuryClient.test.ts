import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import { errorAssertUtil } from '@sprucelabs/test-utils'
import MercuryClientFactory from '../../MercuryClientFactory'
import MercurySocketIoClient from '../../MercurySocketIoClient'

const TEST_HOST = 'https://localhost:8001'

export default class MercuryClientTest extends AbstractSpruceTest {
	@test()
	protected static async factoryCanCreateClient() {
		assert.isTruthy(MercuryClientFactory.Client)
	}


	@test()
	protected static async connectingToBadProtocolThrows() {
		const err = await assert.doesThrowAsync(() =>
			MercuryClientFactory.Client({ host: 'aoeu://tasty.org' })
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

	private static async connect() {
		return await MercuryClientFactory.Client({
			host: TEST_HOST,
			allowSelfSignedCrt: true
		})
	}

	@test()
	protected static async cantEmitEventWithoutContract() {
		const client = await this.connect()
		const err = await assert.doesThrowAsync(() => client.emit('health'))
		errorAssertUtil.assertError(err, 'INVALID_EVENT_NAME')
	}

	@test()
	protected static async cantEmitEventWithInvalidPayload() {
		const client = await this.connect()
		const err = await assert.doesThrowAsync(() => client.emit('health', { taco: 'bravo'}))
		errorAssertUtil.assertError(err, 'INVALID_FIELD')

	
	}

	@test.skip()
	protected static async canRunHealthCheck() {
		const client = await this.connect()

		const health = await client.emit('health')

		assert.isEqualDeep(health, {
			skill: { status: 'passed' },
			mercury: { status: 'passed' },
		})

		await client.disconnect()
	}

}
