import { EventContract } from '@sprucelabs/mercury-types'
import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import { MercuryClientFactory } from '../..'
import { TEST_HOST } from '../../tests/constants'

export default class MercuryClientFactoryTest extends AbstractSpruceTest {
	@test()
	protected static async clientMixinContract() {
		const client = await MercuryClientFactory.Client<EventContract>({
			host: TEST_HOST,
			allowSelfSignedCrt: true,
			contracts: [
				{
					eventSignatures: {},
				},
			],
		})

		assert.isFalse(client.handlesEvent('my-cool-event'))

		client.mixinContract({
			eventSignatures: {
				'my-cool-event': {},
			},
		})

		assert.isTrue(client.handlesEvent('my-cool-event'))

		await client.disconnect()
	}
}
