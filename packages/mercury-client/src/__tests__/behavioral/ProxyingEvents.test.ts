import { eventResponseUtil } from '@sprucelabs/spruce-event-utils'
import { test, assert } from '@sprucelabs/test'
import AbstractClientTest from '../../tests/AbstractClientTest'

export default class ProxyingEventsTest extends AbstractClientTest {
	@test()
	protected static async canMakeRequestAsSomeoneUsingProxy() {
		const { client, person: person1 } = await this.loginAsDemoPerson()
		const { client: client2 } = await this.loginAsDemoPerson()
		const token = `${new Date().getTime()}`

		await client.emit('register-proxy-token::v2020_12_25', {
			payload: {
				token,
			},
		})

		const results = await client2.emit('whoami::v2020_12_25', {
			source: {
				proxyToken: token,
			},
		})

		const { auth } = eventResponseUtil.getFirstResponseOrThrow(results)

		assert.isTruthy(auth.person)
		assert.isEqual(auth.person.id, person1.id)
	}
}
