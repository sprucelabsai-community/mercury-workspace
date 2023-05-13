import { test } from '@sprucelabs/test-utils'
import MercuryClientFactory from '../../clients/MercuryClientFactory'
import MercuryTestClient from '../../clients/MercuryTestClient'
import AbstractClientTest from '../../tests/AbstractClientTest'

export default class EmittingConnectionChangeInTestsTest extends AbstractClientTest {
	@test()
	protected static async canEmitWithoutCrashing() {
		MercuryClientFactory.setIsTestMode(true)
		const emitter = MercuryTestClient.getInternalEmitter()
		await emitter.emitAndFlattenResponses('connection-status-change', {
			payload: {
				status: 'disconnected',
			},
		})
	}
}
