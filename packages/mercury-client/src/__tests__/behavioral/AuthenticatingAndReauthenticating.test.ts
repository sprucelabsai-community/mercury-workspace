import { formatPhoneNumber } from '@sprucelabs/schema'
import { eventResponseUtil } from '@sprucelabs/spruce-event-utils'
import { test, assert } from '@sprucelabs/test-utils'
import { errorAssert } from '@sprucelabs/test-utils'
import AbstractClientTest from '../../tests/AbstractClientTest'
import { DEMO_PHONE_REAUTH, TEST_HOST } from '../../tests/constants'
require('dotenv').config()

export default class ReauthenticatingAfterReconnectTest extends AbstractClientTest {
	@test()
	protected static async authThrowsIfFails() {
		const client = await this.connectToApi()

		await assert.doesThrowAsync(() => client.authenticate({}))
	}

	@test()
	protected static async canAuthAsSkill() {
		const skill = await this.Skill()
		const client = await this.connectToApi()

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
		const { client, token, person } =
			await this.loginAsDemoPerson(DEMO_PHONE_REAUTH)
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

		const client = await this.connectToApi()
		await client.authenticate({
			skillId: skill.id,
			apiKey: skill.apiKey,
		})

		await client.disconnect()

		assert.isFalse(client.isConnected())
	}

	@test()
	protected static async confirmPinFailsValidationClientSideDespiteOneOffLogicForRetainingAuth() {
		const client = await this.connectToApi()

		const err = await assert.doesThrowAsync(() =>
			client.emit('confirm-pin::v2020_12_25', {
				//@ts-ignore
				fails: true,
			})
		)

		errorAssert.assertError(err, 'INVALID_PAYLOAD')
	}

	@test()
	protected static async manuallyDisconnectingDoesNotReconnectPerson() {
		const { token } = await this.loginAsDemoPerson(DEMO_PHONE_REAUTH)
		const client = await this.connectToApi()
		await client.authenticate({
			token,
		})

		await client.disconnect()

		assert.isFalse(client.isConnected())
	}

	@test()
	protected static async losingConnectionAsSkillFromApiTriesReconnect() {
		const skill = await this.Skill()

		const client = await this.connectToApi()
		await client.authenticate({
			skillId: skill.id,
			apiKey: skill.apiKey,
		})

		//@ts-ignore
		client.socket?.disconnect()

		do {
			await this.wait(1000)
		} while (!client.isConnected())

		const results = await client.emit('whoami::v2020_12_25')

		const {
			auth: { skill: whoAmIsSkill },
		} = eventResponseUtil.getFirstResponseOrThrow(results)

		assert.isEqual(whoAmIsSkill?.id, skill.id)
	}

	@test()
	protected static async losingConnectionAsPersonFromApiTriesReconnect() {
		const { token, person } = await this.loginAsDemoPerson(DEMO_PHONE_REAUTH)

		const client = await this.connectToApi()
		await client.authenticate({
			token,
		})

		//@ts-ignore
		client.socket?.disconnect()

		do {
			await this.wait(1000)
		} while (!client.isConnected())

		const results = await client.emit('whoami::v2020_12_25')

		const {
			auth: { person: whoami },
		} = eventResponseUtil.getFirstResponseOrThrow(results)

		assert.isEqual(whoami?.id, person.id)
	}

	@test()
	protected static async losingConnectionBecauseMercuryIsDownDoesNotThrowUnhandledException() {
		const { token, person } = await this.loginAsDemoPerson(DEMO_PHONE_REAUTH)

		const client = await this.connectToApi()

		await client.authenticate({
			token,
		})

		//@ts-ignore
		client.host = 'https://wontwork.workwont'

		//@ts-ignore
		client.socket?.disconnect()

		await this.wait(10)

		assert.isFalse(client.isConnected())

		//@ts-ignore
		client.host = TEST_HOST

		do {
			await this.wait(1000)
		} while (!client.isConnected())

		const results = await client.emit('whoami::v2020_12_25')

		const {
			auth: { person: whoAmI },
		} = eventResponseUtil.getFirstResponseOrThrow(results)

		assert.isEqual(whoAmI?.id, person.id)
	}

	@test()
	protected static async personAuthIsRetainedAfterConfirmingPin() {
		const { client, person } = await this.loginAsDemoPerson(DEMO_PHONE_REAUTH)

		//@ts-ignore
		client.host = 'https://wontwork.workwont'

		//@ts-ignore
		client.socket?.disconnect()

		await this.wait(10)

		assert.isFalse(client.isConnected())

		//@ts-ignore
		client.host = TEST_HOST

		do {
			await this.wait(1000)
		} while (!client.isConnected())

		const results = await client.emit('whoami::v2020_12_25')

		const {
			auth: { person: whoAmI },
		} = eventResponseUtil.getFirstResponseOrThrow(results)

		assert.isEqual(whoAmI?.id, person.id)
	}

	@test()
	protected static async authAsPersonStoresOnClient() {
		const { token } = await this.loginAsDemoPerson(DEMO_PHONE_REAUTH)

		const client = await this.connectToApi()
		await client.authenticate({
			token,
		})

		//@ts-ignore
		assert.isTruthy(client.auth)
		//@ts-ignore
		assert.isTruthy(client.auth.person)
		assert.isEqual(
			//@ts-ignore
			client.auth.person.phone,
			formatPhoneNumber(DEMO_PHONE_REAUTH)
		)
	}

	@test()
	protected static async authAsSkillStoresOnClient() {
		const skill = await this.Skill()
		const client = await this.connectToApi()
		await client.authenticate({
			skillId: skill.id,
			apiKey: skill.apiKey,
		})

		//@ts-ignore
		assert.isTruthy(client.auth)
		//@ts-ignore
		assert.isTruthy(client.auth.skill)
		//@ts-ignore
		assert.isEqual(client.auth.skill.id, skill.id)
	}

	@test()
	protected static async canReAuthIfTimesOutDuringAuth() {
		const skill = await this.Skill()
		const client = await this.connectToApi()

		const promise = client.authenticate({
			skillId: skill.id,
			apiKey: skill.apiKey,
		})

		//@ts-ignore
		client.socket.disconnect()

		await promise
	}

	@test()
	protected static async canAuthenticateAsTheSameSkillRepeatedly() {
		const skill = await this.Skill()
		const client = await this.connectToApi()

		await Promise.all([
			client.authenticate({
				skillId: skill.id,
				apiKey: skill.apiKey,
			}),
			client.authenticate({
				skillId: skill.id,
				apiKey: skill.apiKey,
			}),
			client.authenticate({
				skillId: skill.id,
				apiKey: skill.apiKey,
			}),
		])
	}

	@test()
	protected static async canAuthenticateAsTheSamePersonRepeatedly() {
		const { token } = await this.loginAsDemoPerson()
		const client = await this.connectToApi()

		await Promise.all([
			client.authenticate({
				token,
			}),
			client.authenticate({
				token,
			}),
			client.authenticate({
				token,
			}),
		])
	}

	@test()
	protected static async canAuthenticateAsDifferentSkillAfterAuthenticatingAsFirst() {
		const { client } = await this.loginAsDemoPerson(DEMO_PHONE_REAUTH)

		const skill1 = await this.seedDemoSkill(client)
		await this.seedDemoSkill(client)

		let results = await client.authenticate({
			skillId: skill1.id,
			apiKey: skill1.apiKey,
		})

		assert.isEqualDeep(results.skill?.id, skill1.id)
	}

	private static async Skill() {
		const { skill } = await this.loginAsDemoSkillAtOrg()
		return skill
	}

	private static async loginAsDemoSkillAtOrg() {
		const { client } = await this.loginAsDemoPerson(DEMO_PHONE_REAUTH)
		const org = await this.seedDummyOrg(client)
		const skill = await this.seedAndInstallDummySkill(client, org.id)
		return { client, skill }
	}
}
