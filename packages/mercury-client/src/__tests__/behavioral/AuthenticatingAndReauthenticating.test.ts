import { eventResponseUtil } from '@sprucelabs/spruce-event-utils'
import { test, assert } from '@sprucelabs/test'
import AbstractClientTest from '../../tests/AbstractClientTest'

export default class ReauthenticatingAfterReconnectTest extends AbstractClientTest {
	@test()
	protected static async authThrowsIfFails() {
		const client = await this.Client()

		await assert.doesThrowAsync(() => client.authenticate({}))
	}

	@test()
	protected static async canAuthAsSkill() {
		const skill = await this.Skill()
		const client = await this.Client()

		const { skill: authSkill } = await client.authenticate({
			skillId: skill.id,
			apiKey: skill.apiKey,
		})
		assert.isTruthy(authSkill)
		assert.isEqual(authSkill.id, skill.id)

		const results = await client.emit('whoami::v2020_12_25')

		const { auth } = eventResponseUtil.getFirstResponseOrThrow(results)

		assert.isTruthy(auth.skill)
		assert.isEqual(auth.skill.id, skill.id)
	}

	@test()
	protected static async canAuthAsPerson() {
		const { client, token, person } = await this.loginAsDemoPerson()
		const { person: authPerson } = await client.authenticate({
			token,
		})

		assert.isTruthy(authPerson)
		assert.isEqual(authPerson.id, person.id)

		const results = await client.emit('whoami::v2020_12_25')
		const { auth } = eventResponseUtil.getFirstResponseOrThrow(results)

		assert.isTruthy(auth.person)
		assert.isEqual(auth.person.id, person.id)
	}

	@test()
	protected static async manuallyDisconnectingDoesNotReconnectSkill() {
		const skill = await this.Skill()

		const client = await this.Client()
		await client.authenticate({
			skillId: skill.id,
			apiKey: skill.apiKey,
		})

		await client.disconnect()

		assert.isFalse(client.isConnected())
	}

	@test()
	protected static async manuallyDisconnectingDoesNotReconnectPerson() {
		const { token } = await this.loginAsDemoPerson()
		const client = await this.Client()
		await client.authenticate({
			token,
		})

		await client.disconnect()

		assert.isFalse(client.isConnected())
	}

	@test()
	protected static async losingConnectionAsSkillFromApiTriesReconnect() {
		const skill = await this.Skill()

		const client = await this.Client()
		await client.authenticate({
			skillId: skill.id,
			apiKey: skill.apiKey,
		})

		//@ts-ignore
		client.socket?.disconnect()

		await this.wait(1000)

		assert.isTrue(client.isConnected())

		const results = await client.emit('whoami::v2020_12_25')

		const {
			auth: { skill: whoAmIsSkill },
		} = eventResponseUtil.getFirstResponseOrThrow(results)

		assert.isEqual(whoAmIsSkill?.id, skill.id)
	}

	@test()
	protected static async losingConnectionAsPersonFromApiTriesReconnect() {
		const { token, person } = await this.loginAsDemoPerson()

		const client = await this.Client()
		await client.authenticate({
			token,
		})

		//@ts-ignore
		client.socket?.disconnect()

		await this.wait(1000)

		assert.isTrue(client.isConnected())

		const results = await client.emit('whoami::v2020_12_25')

		const {
			auth: { person: whoAmI },
		} = eventResponseUtil.getFirstResponseOrThrow(results)

		assert.isEqual(whoAmI?.id, person.id)
	}

	private static async Skill() {
		const { skill } = await this.loginAsDemoSkill()
		return skill
	}

	private static async loginAsDemoSkill() {
		const { client } = await this.loginAsDemoPerson()
		const org = await this.seedDummyOrg(client)
		const skill = await this.seedAndInstallDummySkill(client, org)
		return { client, skill }
	}
}
