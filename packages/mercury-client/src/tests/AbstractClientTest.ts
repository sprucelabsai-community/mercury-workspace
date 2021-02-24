import {
	CoreEventContract,
	coreEventContracts,
	SpruceSchemas,
} from '@sprucelabs/mercury-types'
import { eventResponseUtil } from '@sprucelabs/spruce-event-utils'
import AbstractSpruceTest, { assert } from '@sprucelabs/test'
import { ConnectionOptions, MercuryClient } from '../client.types'
import MercuryClientFactory from '../clients/MercuryClientFactory'
import SpruceError from '../errors/SpruceError'
import { TEST_HOST } from './constants'

type Client = MercuryClient<CoreEventContract>
type Person = SpruceSchemas.Spruce.v2020_07_22.Person
type Organization = SpruceSchemas.Spruce.v2020_07_22.Organization

export default class AbstractClientTest extends AbstractSpruceTest {
	private static dummySkillCount = 0
	protected static clients: Client[] = []

	protected static async afterEach() {
		await super.afterEach()

		for (const client of this.clients) {
			await client.disconnect()
		}

		this.clients = []
	}

	protected static async Client(
		options?: Partial<ConnectionOptions>
	): Promise<Client> {
		const { host = TEST_HOST, ...rest } = options || {}

		const client = await MercuryClientFactory.Client<CoreEventContract>({
			host,
			allowSelfSignedCrt: true,
			contracts: coreEventContracts,
			...rest,
		})

		this.clients.push(client)

		return client
	}

	protected static async loginAsDemoPerson(): Promise<{
		person: Person
		client: Client
		token: string
	}> {
		const client = await this.Client()
		const phone = process.env.DEMO_PHONE

		if (!phone) {
			throw new SpruceError({
				code: 'MISSING_PARAMETERS',
				parameters: ['env.DEMO_PHONE'],
			})
		}

		const requestPinResults = await client.emit('request-pin::v2020_12_25', {
			payload: {
				phone,
			},
		})

		const { challenge } = eventResponseUtil.getFirstResponseOrThrow(
			requestPinResults
		)

		assert.isTruthy(challenge)

		const confirmPinResults = await client.emit('confirm-pin::v2020_12_25', {
			payload: {
				challenge,
				pin: phone.substr(-4),
			},
		})

		const { person, token } = eventResponseUtil.getFirstResponseOrThrow(
			confirmPinResults
		)

		assert.isTruthy(person, 'Failed to login!')

		return { person, client, token }
	}

	protected static async seedDummyOrg(client: Client) {
		const orgName = `Dummy org ${new Date().getTime()}`
		const orgResults = await client.emit('create-organization::v2020_12_25', {
			payload: {
				name: orgName,
			},
		})

		const org = orgResults.responses[0].payload?.organization

		assert.isTruthy(org)

		return org
	}

	protected static async seedInstallAndLoginAsSkill(
		client: Client,
		org: Organization
	) {
		const skill = await this.seedAndInstallDummySkill(client, org)

		const skillClient = await this.Client()
		const authResults = await skillClient.emit('authenticate::v2020_12_25', {
			payload: {
				skillId: skill.id,
				apiKey: skill.apiKey,
			},
		})

		assert.isEqual(authResults.totalErrors, 0)

		return { skill, skillClient }
	}

	protected static async seedAndInstallDummySkill(
		client: Client,
		org: Organization
	) {
		const skill1Results = await client.emit('register-skill::v2020_12_25', {
			payload: {
				name: `Dummy skill ${this.dummySkillCount++} ${new Date().getTime()}`,
			},
		})

		const skill = skill1Results.responses[0].payload?.skill
		assert.isTruthy(skill)

		const installResults = await client.emit('install-skill::v2020_12_25', {
			target: {
				organizationId: org.id,
			},
			payload: { skillId: skill.id },
		})

		assert.isEqual(installResults.totalErrors, 0)

		return skill
	}
}
