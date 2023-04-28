import { test, assert } from '@sprucelabs/test-utils'
import MercuryClientFactory from '../../clients/MercuryClientFactory'
import AbstractClientTest from '../../tests/AbstractClientTest'

export default class TurningOffAListenerTest extends AbstractClientTest {
	@test()
	protected static async canCreateTurningOffAListener() {
		MercuryClientFactory.setIsTestMode(true)
		const client = await this.connectToApi()

		await client.emit('whoami::v2020_12_25')

		let hitCount = 0

		await client.on('whoami::v2020_12_25', () => {
			hitCount++
			return {} as any
		})

		await client.emit('whoami::v2020_12_25')

		assert.isEqual(hitCount, 1)

		await client.off('whoami::v2020_12_25')

		await client.emit('whoami::v2020_12_25')

		assert.isEqual(hitCount, 1)
	}
}
