import { test, assert } from '@sprucelabs/test'
import MercuryClientFactory from '../../clients/MercuryClientFactory'
import AbstractClientTest from '../../tests/AbstractClientTest'

export default class TestingWithDefaultContractsTest extends AbstractClientTest {
	@test()
	protected static noDefaultContractToStart() {
		assert.isFalse(MercuryClientFactory.hasDefaultContract())
	}

	@test()
	protected static canSetAndGet() {
		MercuryClientFactory.setDefaultContract({
			eventSignatures: { myEvent: {} },
		})

		assert.isTrue(MercuryClientFactory.hasDefaultContract())
	}

	@test()
	protected static canClearDefaultContract() {
		MercuryClientFactory.setDefaultContract({
			eventSignatures: { myEvent: {} },
		})

		MercuryClientFactory.clearDefaultContract()

		assert.isFalse(MercuryClientFactory.hasDefaultContract())
	}
}
