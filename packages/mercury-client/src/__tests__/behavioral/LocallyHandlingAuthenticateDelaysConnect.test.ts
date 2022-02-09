import { eventResponseUtil } from '@sprucelabs/spruce-event-utils'
import { test, assert } from '@sprucelabs/test'
import { MercuryClientFactory } from '../..'
import AbstractClientTest from '../../tests/AbstractClientTest'

export default class LocallyHandlingAuthenticateDelaysConnectTest extends AbstractClientTest {
	protected static async beforeEach() {
		await super.beforeEach()
		MercuryClientFactory.setIsTestMode(true)
	}

	@test()
	protected static async locallyHandlingAuthenticateDelaysConnect() {
		const { skillClient, skill } = await this.mockAuthAndGetClient()

		//@ts-ignore
		assert.isFalse(skillClient.isConnectedToApi)

		const results = await skillClient.emit('whoami::v2020_12_25')

		//@ts-ignore
		assert.isTrue(skillClient.isConnectedToApi)

		const { auth, type } = eventResponseUtil.getFirstResponseOrThrow(results)

		assert.isEqual(type, 'authenticated')
		assert.doesInclude(skill, auth.skill)
	}

	@test()
	protected static async delayedConnectHandlesManyParallelRequests() {
		const { skillClient } = await this.mockAuthAndGetClient()

		//@ts-ignore
		assert.isFalse(skillClient.isConnectedToApi)

		const all = await Promise.all([
			skillClient.emit('whoami::v2020_12_25'),
			skillClient.emit('whoami::v2020_12_25'),
			skillClient.emit('whoami::v2020_12_25'),
			skillClient.emit('whoami::v2020_12_25'),
			skillClient.emit('whoami::v2020_12_25'),
		])

		for (const response of all) {
			assert.isEqual(response.responses[0].payload?.type, 'authenticated')
		}
	}

	private static async mockAuthAndGetClient() {
		const { client: creatorClient, person } = await this.loginAsDemoPerson()
		const skill = await this.seedDemoSkill(creatorClient)
		const skillClient = await this.Client()

		await creatorClient.on('authenticate::v2020_12_25', async () => {
			return {
				type: 'authenticated' as any,
				auth: {
					skill: {
						...skill,
						creators: [
							{
								personId: person.id,
							},
						],
					},
				},
			}
		})

		await skillClient.authenticate({
			skillId: skill.id,
			apiKey: skill.apiKey,
		})
		return { skillClient, skill }
	}
}
