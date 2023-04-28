import { buildEventContract } from '@sprucelabs/mercury-types'
import { generateId, test } from '@sprucelabs/test-utils'
import MercuryClientFactory from '../../clients/MercuryClientFactory'
import MercuryTestClient from '../../clients/MercuryTestClient'
import AbstractClientTest from '../../tests/AbstractClientTest'

export default class TestClientSpeedTestsTest extends AbstractClientTest {
	protected static async beforeEach() {
		await super.beforeEach()
		MercuryClientFactory.setIsTestMode(true)
	}

	@test()
	protected static async canCreateTestClientSpeedTests() {
		new Array(1000)
			.fill(0)
			.map(() => this.emitter.mixinOnlyUniqueSignatures(this.buildContract()))
	}

	private static buildContract() {
		return buildEventContract({
			eventSignatures: {
				[generateId()]: {
					isGlobal: true,
				},
			},
		})
	}

	private static get emitter() {
		//@ts-ignore
		return MercuryTestClient.emitter
	}
}
