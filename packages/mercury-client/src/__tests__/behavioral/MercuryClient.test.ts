import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import { errorAssertUtil } from '@sprucelabs/test-utils'
import MercuryClientFactory from '../../MercuryClientFactory'
import MercurySocketIoClient from '../../MercurySocketIoClient'

export default class MercuryClientTest extends AbstractSpruceTest {
	@test()
	protected static async factoryCanCreateClient() {
		assert.isTruthy(MercuryClientFactory.Client)
	}

	@test.skip()
	protected static async factoryReturnsSocketIoClient() {
		const client = await MercuryClientFactory.Client({})
		assert.isTruthy(client instanceof MercurySocketIoClient)
		await client.disconnect()
	}

	@test()
	protected static async connectingToBadProtocolThrows() {
		const err = await assert.doesThrowAsync(() =>
			MercuryClientFactory.Client({ host: 'aoeu://tasty.org' })
		)
		errorAssertUtil.assertError(err, 'INVALID_PROTOCOL')
