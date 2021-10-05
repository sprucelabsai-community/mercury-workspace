import { test, assert } from '@sprucelabs/test'
import AbstractClientTest from '../../tests/AbstractClientTest'

export default class ReconnectingAutomaticallyTest extends AbstractClientTest {
	@test()
	protected static async invokesReconnectAfterDelayWhenConnectionLost() {
		const client = await this.Client({ reconnectDelayMs: 0 })

		let wasHit = false

		//@ts-ignore
		client.attemptReconnectAfterDelay = () => {
			wasHit = true
		}

		//@ts-ignore
		client.socket.emitReserved('connect_error', new Error('fail'))

		assert.isTrue(wasHit)
	}
}
