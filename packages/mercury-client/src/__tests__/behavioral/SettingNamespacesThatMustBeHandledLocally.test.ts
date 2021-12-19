import { test, assert } from '@sprucelabs/test'
import { errorAssertUtil } from '@sprucelabs/test-utils'
import { MercuryClientFactory, MercuryTestClient } from '../..'
import AbstractClientTest from '../../tests/AbstractClientTest'

export default class SettingNamespacesThatMustBeHandledLocallyTest extends AbstractClientTest {
	protected static async beforeEach() {
		await super.beforeEach()
		MercuryClientFactory.setIsTestMode(true)
	}

	@test('handled locall with [test]', ['test'], 'test.should-have-listener')
	@test(
		'handled locall with [heartwood]',
		['test', 'heartwood'],
		'heartwood.should-have-listener'
	)
	protected static async canSetNamespaceThatMustBeHandledLocally(
		namespaces: string[],
		fqen: string
	) {
		const client = (await this.Client({})) as MercuryTestClient

		MercuryTestClient.setNamespacesThatMustBeHandledLocally(namespaces)

		client.mixinContract({
			eventSignatures: {
				[fqen]: {},
			},
		})

		const err = await assert.doesThrowAsync(() => client.emit(fqen))

		errorAssertUtil.assertError(err, 'MUST_HANDLE_LOCALLY')
	}
}
