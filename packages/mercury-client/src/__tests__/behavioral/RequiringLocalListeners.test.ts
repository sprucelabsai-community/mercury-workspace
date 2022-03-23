import { test, assert } from '@sprucelabs/test'
import { errorAssert } from '@sprucelabs/test-utils'
import MercuryClientFactory from '../../clients/MercuryClientFactory'
import AbstractClientTest from '../../tests/AbstractClientTest'

export default class RequiringLocalListenersTest extends AbstractClientTest {
	@test()
	protected static async canCreateDisablingRemoteCalls() {
		MercuryClientFactory.setIsTestMode(true)
		MercuryClientFactory.setShouldRequireLocalListeners(true)

		const client = await this.connectToApi()

		const err = await assert.doesThrowAsync(() =>
			client.emit('whoami::v2020_12_25')
		)

		errorAssert.assertError(err, 'MUST_HANDLE_LOCALLY')

		const client2 = await this.connectToApi()

		await client2.on('whoami::v2020_12_25', () => {
			return {
				auth: {},
				type: 'anonymous' as const,
			}
		})

		await client.emit('whoami::v2020_12_25')
	}
}
