import { coreEventContracts } from '@sprucelabs/mercury-core-events'
import { test, assert } from '@sprucelabs/test'
import { MercuryClient, MercuryClientFactory } from '../..'
import MercuryTestClient from '../../clients/MercuryTestClient'
import AbstractClientTest from '../../tests/AbstractClientTest'

export default class DisablingEventValidationWhenEmittingLocallyTest extends AbstractClientTest {
	private static client: MercuryClient
	protected static async beforeEach() {
		await super.beforeEach()

		MercuryClientFactory.setIsTestMode(true)
		MercuryClientFactory.setDefaultContract(coreEventContracts[0] as any)

		const client = await this.Client()
		assert.isTrue(client.getIsTestClient())

		this.client = client
	}

	@test()
	protected static hasSetter() {
		assert.isFunction(MercuryTestClient.setShouldValidateLocalEvents)
	}

	@test()
	protected static async canDisableEventValidation() {
		MercuryTestClient.setShouldValidateLocalEvents(false)

		let wasHit = false

		await this.client.on('does-honor-permission-contract::v2020_12_25', () => {
			wasHit = true
			return {
				doesHonor: true,
			}
		})

		await this.client.emit('whoami::v2020_12_25')

		assert.isFalse(wasHit)
	}
}
