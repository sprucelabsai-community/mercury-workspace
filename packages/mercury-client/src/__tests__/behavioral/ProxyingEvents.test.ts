import { eventResponseUtil } from '@sprucelabs/spruce-event-utils'
import { test, assert } from '@sprucelabs/test'
import AbstractClientTest from '../../tests/AbstractClientTest'

export default class ProxyingEventsTest extends AbstractClientTest {
	@test()
	protected static async canMakeRequestAsSomeoneUsingProxy() {
		const { person1, token, client2 } = await this.loginAndRegisterToken()

		const results = await client2.emit('whoami::v2020_12_25', {
			source: {
				proxyToken: token,
			},
		})

		this.assertPerson1CameBack(results, person1)
	}

	private static assertPerson1CameBack(results: any, person1: any) {
		const { auth } = eventResponseUtil.getFirstResponseOrThrow(results)

		assert.isTruthy(auth.person)
		assert.isEqual(auth.person.id, person1.id)
	}

	private static async loginAndRegisterToken() {
		const { client, person: person1 } = await this.loginAsDemoPerson()
		const { client: client2 } = await this.loginAsDemoPerson()

		const results = await client.emit('register-proxy-token::v2020_12_25')

		const { token } = eventResponseUtil.getFirstResponseOrThrow(results)

		return { person1, token, client2 }
	}
}
