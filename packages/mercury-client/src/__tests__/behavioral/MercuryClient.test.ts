import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import { errorAssertUtil } from '@sprucelabs/test-utils'
import { MercuryClient } from '../../client.types'
import MercuryClientFactory from '../../MercuryClientFactory'
import MercurySocketIoClient from '../../MercurySocketIoClient'
import {
	TestEventContract,
	testEventContract,
} from '../support/TestEventContract'

const TEST_HOST = 'https://localhost:8001'

export default class MercuryClientTest extends AbstractSpruceTest {

	private static client?: MercuryClient<TestEventContract>

	protected static async afterEach() {
		await super.afterEach()
		await this.client?.disconnect()
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

	private static async connect() {
		const client = await MercuryClientFactory.Client<TestEventContract>({
			host: TEST_HOST,
			allowSelfSignedCrt: true,
			contracts: [testEventContract],
		})

		this.client = client

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
		const health = await client.emit('health')

		assert.isEqualDeep(health.responses[0].payload, {
			skill: { status: 'passed' },
			mercury: { status: 'passed' },
		})

		
		await client.disconnect()
		
	}
}
