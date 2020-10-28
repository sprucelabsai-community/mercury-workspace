import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import MercuryClientFactory from '../../MercuryClientFactory'


export default class MercuryClientTest extends AbstractSpruceTest {

	@test()
	protected static async factoryCanCreateClient() {
		assert.isTruthy(MercuryClientFactory.Client)	
	}

	@test()
	protected static async factoryReturnsSocketIoClient() {
		const client = await MercuryClientFactory.Client({})
		assert.isTruthy(client instanceof MercurySocketIoClient)
	}
}
