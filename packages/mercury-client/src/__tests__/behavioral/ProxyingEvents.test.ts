import {
	eventAssertUtil,
	eventResponseUtil,
} from '@sprucelabs/spruce-event-utils'
import { test, assert } from '@sprucelabs/test-utils'
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

	@test()
	protected static async canUseRegisterProxyMethod() {
		const { client } = await this.loginAsDemoPerson()

		assert.isFunction(client.registerProxyToken)
		const token = await client.registerProxyToken()
		const actual = client.getProxyToken()

		assert.isEqual(token, actual)
	}

	@test()
	protected static async registerTokenMethodRegistersValidToken() {
		const { client, person } = await this.loginAsDemoPerson()
		const { client: client1 } = await this.loginAsDemoPerson()

		assert.isFunction(client.registerProxyToken)

		const token = await client.registerProxyToken()

		await this.assertClientWithTokenComesBackWithPerson(client1, token, person)
	}

	@test()
	protected static async clientRegistersNewProxyTokenOnReconnect() {
		const { client, person } = await this.loginAsDemoPerson()

		const token1 = await client.registerProxyToken()

		//@ts-ignore
		client.socket.disconnect()

		let token2: string | null = null

		do {
			token2 = client.getProxyToken()
			await this.wait(100)
		} while (!token2)

		assert.isNotEqual(token1, token2)

		const { client: client2 } = await this.loginAsDemoPerson()

		await this.assertClientWithTokenComesBackWithPerson(client2, token2, person)
	}

	@test()
	protected static async proxyTokenNotSentToAuthenticate() {
		const anonClient = await this.connectToApi()
		const { client } = await this.loginAsDemoPerson()

		const token = await client.registerProxyToken()

		anonClient.setProxyToken(token)

		const err = await assert.doesThrowAsync(() =>
			anonClient.authenticate({
				token: '234234',
			})
		)

		eventAssertUtil.assertError(err, 'INVALID_AUTH_TOKEN')
	}

	private static async assertClientWithTokenComesBackWithPerson(
		client: any,
		token: string,
		person: any
	) {
		const results = await client.emit('whoami::v2020_12_25', {
			source: {
				proxyToken: token,
			},
		})

		this.assertPerson1CameBack(results, person)
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
