import {
	eventContractUtil,
	eventResponseUtil,
} from '@sprucelabs/spruce-event-utils'
import { assert, test } from '@sprucelabs/test-utils'
import { MercuryClient } from '../..'
import AbstractClientTest from '../../tests/AbstractClientTest'
import { DEMO_PHONE_FLATTEN_1 } from '../../tests/constants'

export default class EmittingAndFlatteningResponsesTest extends AbstractClientTest {
	private static client: MercuryClient
	protected static async beforeEach() {
		await super.beforeEach()

		const { client } = await this.loginAsDemoPerson(DEMO_PHONE_FLATTEN_1)
		this.client = client
	}

	@test()
	protected static async hasMethod() {
		assert.isFunction(this.client.emitAndFlattenResponses)
	}

	@test()
	protected static async throwsWhenPassedBadEvent() {
		await assert.doesThrowAsync(() =>
			//@ts-ignore
			this.client.emitAndFlattenResponses('aoeuaoeu')
		)
	}

	@test()
	protected static async canGetAuthBack() {
		const [{ auth }] = await this.client.emitAndFlattenResponses(
			'whoami::v2020_12_25'
		)

		const { auth: expected } = await this.emit()

		assert.isEqualDeep(auth, expected)
	}

	@test()
	protected static async throwsIfFirstResponseIsError() {
		const { client, name, org } = await this.seedSkillsAndRegisterEvent()

		await client.on(name, () => {
			throw new Error('testing')
		})

		const err = await assert.doesThrowAsync(() =>
			//@ts-ignore
			client.emitAndFlattenResponses(name, {
				target: { organizationId: org.id },
			})
		)

		assert.doesInclude(err.message, 'testing')
	}

	@test()
	protected static async getsBackAllResponses() {
		const { client, name, org, skill2Client } =
			await this.seedSkillsAndRegisterEvent()

		let hitCount = 0

		//@ts-ignore
		await client.on(name, () => {
			return {
				messages: ['first'],
			}
		})

		//@ts-ignore
		await skill2Client.on(name, () => {
			return {
				messages: ['second'],
			}
		})

		const results = await client.emitAndFlattenResponses(
			name,
			{
				//@ts-ignore
				target: {
					organizationId: org.id,
				},
			},
			() => {
				hitCount++
			}
		)

		assert.isLength(results, 2)
		assert.isEqual(hitCount, 2)
	}

	@test()
	protected static async callsCallbackInFirst() {
		const { client, name, org } = await this.seedSkillsAndRegisterEvent()
		//@ts-ignore
		await client.on(name, () => {
			return {
				messages: ['first'],
			}
		})

		let wasHit = false

		await client.emitAndFlattenResponses(
			name,
			{
				//@ts-ignore
				target: {
					organizationId: org.id,
				},
			},
			() => {
				wasHit = true
			}
		)

		assert.isTrue(wasHit)
	}

	protected static async seedSkillsAndRegisterEvent() {
		const org = await this.seedDummyOrg(this.client)
		const { skill, client } = await this.seedInstallAndLoginAsSkill(
			this.client,
			org.id
		)

		const { client: skill2Client } = await this.seedInstallAndLoginAsSkill(
			this.client,
			org.id
		)

		const sig = await this.registerEvent(skill.slug, client)
		const name = eventContractUtil.getEventNames(sig)[0] as any

		return { client, name, org, skill2Client }
	}

	protected static async emit() {
		const results = await this.client.emit('whoami::v2020_12_25')
		return eventResponseUtil.getFirstResponseOrThrow(results)
	}
}
