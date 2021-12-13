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
		const { client, person } = await this.loginAsDemoPerson()
		const skill = await this.seedDemoSkill(client)
		const client2 = await this.Client()

		await client.on('authenticate::v2020_12_25', async () => {
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

		await client2.authenticate({
			skillId: skill.id,
			apiKey: skill.apiKey,
		})

		//@ts-ignore
		assert.isFalse(client2.isConnectedToApi)

		const results = await client2.emit('whoami::v2020_12_25')

		//@ts-ignore
		assert.isTrue(client2.isConnectedToApi)

		const { auth, type } = eventResponseUtil.getFirstResponseOrThrow(results)

		assert.isEqual(type, 'authenticated')
		assert.doesInclude(skill, auth.skill)
	}
}
