import { eventResponseUtil } from '@sprucelabs/spruce-event-utils'
import { test, assert } from '@sprucelabs/test'
import AbstractClientTest from '../../tests/AbstractClientTest'

export default class ReconnectingAutomaticallyTest extends AbstractClientTest {
	@test()
	protected static async invokesReconnectAfterDelayWhenConnectionLost() {
		const client = await this.ClientZeroDelay()

		let wasHit = false

		//@ts-ignore
		client.attemptReconnectAfterDelay = () => {
			wasHit = true
		}

		//@ts-ignore
		client.socket.emitReserved('connect_error', new Error('fail'))

		assert.isTrue(wasHit)
	}

	@test()
	protected static async reconnectsWhenEmittingEventWhenDisconnected() {
		const client = await ReconnectingAutomaticallyTest.ClientZeroDelay()

		//@ts-ignore
		client.socket.disconnect()

		await this.wait(100)

		const results = await client.emit('whoami::v2020_12_25')

		eventResponseUtil.getFirstResponseOrThrow(results)
	}

	private static async ClientZeroDelay() {
		return await super.Client({ reconnectDelayMs: 0 })
	}

	@test()
	protected static async shouldThrowWhenEmittingAfterManualDisconnect() {
		const client = await this.ClientZeroDelay()

		await client.disconnect()

		await assert.doesThrowAsync(
			() => client.emit('whoami::v2020_12_25'),
			'not connected'
		)
	}

	@test()
	protected static async retriesEventIfItFailsAfterTimeout() {
		const client = await this.ClientZeroDelay()

		const promise = client.emit('whoami::v2020_12_25')

		//@ts-ignore
		client.socket.disconnect()

		await this.wait(100)

		const results = await promise

		eventResponseUtil.getFirstResponseOrThrow(results)
	}
}
