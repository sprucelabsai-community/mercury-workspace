import { test } from '@sprucelabs/test'
import MercuryClientFactory from '../../clients/MercuryClientFactory'
import AbstractClientTest from '../../tests/AbstractClientTest'

export default class TurningOffAListenerTest extends AbstractClientTest {
	@test()
	protected static async canCreateTurningOffAListener() {
		MercuryClientFactory.setIsTestMode(true)
		const client = await this.Client()
		await client.off('authenticate::v2020_12_25')
	}
}
