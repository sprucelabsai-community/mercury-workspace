import fsUtil from 'fs'
import osUtil from 'os'
import pathUtil from 'path'
import { eventResponseUtil } from '@sprucelabs/spruce-event-utils'
import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import { errorAssertUtil } from '@sprucelabs/test-utils'
import { MercuryClientFactory } from '../..'
import { TEST_HOST } from '../../tests/constants'

export default class SimulatingEventsForTestingTest extends AbstractSpruceTest {
	@test()
	protected static testModeFalseByDefault() {
		assert.isFalse(MercuryClientFactory.isInTestMode())
	}

	@test()
	protected static async canSetTestMode() {
		MercuryClientFactory.setIsTestMode(true)
		assert.isTrue(MercuryClientFactory.isInTestMode())
	}

	@test()
	protected static async testModeThrowsIfNoCacheDirSetForContract() {
		MercuryClientFactory.setIsTestMode(true)

		const err = await assert.doesThrowAsync(() => MercuryClientFactory.Client())

		errorAssertUtil.assertError(err, 'MISSING_TEST_CACHE_DIR')
	}

	@test()
	protected static async testModeWritesContractToCacheDir() {
		const expectedFile = await this.connectAndGetCachedContractFilepath()

		assert.isTrue(fsUtil.existsSync(expectedFile))
	}

	private static readonly eventName = 'whoami::v2020_12_25'

	@test()
	protected static async testModeWritesValidContractAndMixesItIntoClient() {
		const expectedFile = await this.connectAndGetCachedContractFilepath()
		const contents = fsUtil
			.readFileSync(expectedFile)
			.toString()
			.replace('module.exports =', '')

		const contracts = JSON.parse(contents)

		assert.isArray(contracts)
		assert.isTruthy(contracts[0].eventSignatures)
		assert.isTruthy(contracts[0].eventSignatures[this.eventName])

		const client = await this.connectToApi()

		assert.isTrue(client.handlesEvent(this.eventName))
		assert.isFalse(client.handlesEvent('taco-bravo'))

		await client.disconnect()
	}

	@test()
	protected static async clientDoesntWriteContractIfItAlreadyExists() {
		const contractFile = await this.connectAndGetCachedContractFilepath()
		fsUtil.writeFileSync(
			contractFile,
			'module.exports = [{eventSignatures:{"taco-bravo": {}}}]'
		)

		const client = await this.connectToApi()
		assert.isTrue(client.handlesEvent('taco-bravo'))

		await client.disconnect()
	}

	private static async connectAndGetCachedContractFilepath() {
		MercuryClientFactory.setIsTestMode(true)
		const cacheDir = this.generateTmpDir()

		MercuryClientFactory.setTestCacheDir(cacheDir)

		const client = await this.connectToApi()
		await client.disconnect()

		const expectedFile = pathUtil.join(cacheDir, 'events.contract.js')
		return expectedFile
	}

	private static async connectToApi() {
		return await MercuryClientFactory.Client({ host: TEST_HOST })
	}

	private static generateTmpDir() {
		return pathUtil.join(osUtil.tmpdir(), new Date().getTime().toString())
	}
}
