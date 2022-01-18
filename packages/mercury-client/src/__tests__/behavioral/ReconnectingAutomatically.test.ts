import { eventResponseUtil } from '@sprucelabs/spruce-event-utils'
import { test, assert } from '@sprucelabs/test'
import { errorAssertUtil } from '@sprucelabs/test-utils'
import { MercuryClientFactory } from '../..'
import AbstractClientTest from '../../tests/AbstractClientTest'

export default class ReconnectingAutomaticallyTest extends AbstractClientTest {
	protected static async beforeEach() {
		await super.beforeEach()
		MercuryClientFactory.setIsTestMode(false)
	}

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
		const client = await this.ClientZeroDelay()

		//@ts-ignore
		client.socket.disconnect()

		await this.wait(100)

		const results = await client.emit('whoami::v2020_12_25')

		eventResponseUtil.getFirstResponseOrThrow(results)
	}

	@test()
	protected static async shouldThrowWhenEmittingAfterManualDisconnect() {
		const client = await this.ClientZeroDelay()

		await client.disconnect()

		await assert.doesThrowAsync(
			() => client.emit('whoami::v2020_12_25'),
			'after you have manually disconnected'
		)
	}

	@test()
	protected static async retriesEventIfItFailsAfterTimeout() {
		await this.assertRetriesEmitOnDisconnect()
	}

	@test()
	protected static async retriesEventIfItFailsAfterTimeoutWithTestClient() {
		MercuryClientFactory.setIsTestMode(true)
		await this.assertRetriesEmitOnDisconnect()
	}

	@test()
	protected static async timingOutDuringAuthDoesntThrowAuthBlockedError() {
		const client = await this.Client({ emitTimeoutMs: 1 })

		const err = await assert.doesThrowAsync(() =>
			client.authenticate({ token: 'duh' })
		)

		errorAssertUtil.assertError(err, 'TIMEOUT')
	}

	@test()
	protected static async manuallyDisconnectStopsReconnectAttempts() {
		const client = await this.Client()

		//@ts-ignore
		client.host = 'https://wontwork.workwont'

		//@ts-ignore
		void client.socket.disconnect()

		await this.wait(10)

		await client.disconnect()

		await this.wait(1000)

		//@ts-ignore
		assert.isFalse(client.isReconnecting)
	}

	private static async ClientZeroDelay() {
		return await this.Client({ reconnectDelayMs: 0 })
	}

	private static async assertRetriesEmitOnDisconnect() {
		const client = await this.ClientZeroDelay()

		const promise = client.emit('whoami::v2020_12_25')

		await this.wait(1000)

		//@ts-ignore
		client.socket.disconnect()

		await this.wait(100)

		const results = await promise

		eventResponseUtil.getFirstResponseOrThrow(results)
	}
}
