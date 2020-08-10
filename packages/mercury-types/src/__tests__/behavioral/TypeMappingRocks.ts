import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'

export default class TypesWorkTest extends AbstractSpruceTest {
	@test()
	protected static async firstTest() {
		// test here
	}

	@test()
	protected static async typesWork() {
		assert.isTrue(false)
	}
}
