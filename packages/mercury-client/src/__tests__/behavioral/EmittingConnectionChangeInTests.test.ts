import { test } from '@sprucelabs/test-utils'
import MercuryClientFactory from '../../clients/MercuryClientFactory'
import MercuryTestClient from '../../clients/MercuryTestClient'
import AbstractClientTest from '../../tests/AbstractClientTest'

export default class EmittingConnectionChangeInTestsTest extends AbstractClientTest {
	protected static async beforeEach() {
		await super.beforeEach()
		MercuryClientFactory.setIsTestMode(true)
	}

	@test()
	protected static async canEmitWithoutCrashing() {
		MercuryClientFactory.setIsTestMode(true)
		const emitter = MercuryTestClient.getInternalEmitter()
		await emitter.emitAndFlattenResponses('connection-status-change', {
			payload: {
				status: 'disconnected',
			},
		})

		const client = await this.connectToApi()

		await client.emitAndFlattenResponses('connection-status-change', {
			payload: {
				status: 'disconnected',
			},
		})
	}

	@test()
	protected static async doesntCrashTryingToMixinTwice() {
		//@ts-ignore
		delete MercuryTestClient.emitter
		await this.connectToApi()
	}
}
