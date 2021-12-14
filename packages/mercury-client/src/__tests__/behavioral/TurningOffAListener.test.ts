import { test, assert } from '@sprucelabs/test'
import MercuryClientFactory from '../../clients/MercuryClientFactory'
import AbstractClientTest from '../../tests/AbstractClientTest'

export default class TurningOffAListenerTest extends AbstractClientTest {
	@test()
	protected static async canCreateTurningOffAListener() {
		MercuryClientFactory.setIsTestMode(true)
		const client = await this.Client()

		let wasHit = false

		await client.on('whoami::v2020_12_25', () => {
			wasHit = true
			return {} as any
		})

		await client.off('whoami::v2020_12_25')

		await client.emit('whoami::v2020_12_25')

		assert.isFalse(wasHit)
	}
}
