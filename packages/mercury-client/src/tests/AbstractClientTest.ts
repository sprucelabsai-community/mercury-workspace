import { coreEventContracts } from '@sprucelabs/mercury-core-events'
import { SpruceSchemas } from '@sprucelabs/mercury-types'
import { SchemaError } from '@sprucelabs/schema'
import { eventResponseUtil } from '@sprucelabs/spruce-event-utils'
import AbstractSpruceTest, { assert } from '@sprucelabs/test'
import MercuryClientFactory from '../clients/MercuryClientFactory'
import { ConnectionOptions, MercuryClient } from '../types/client.types'
import { TEST_HOST } from './constants'

type Client = MercuryClient
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

	protected static async beforeEach() {
		await super.beforeEach()
		MercuryClientFactory.reset()
	}

	protected static async beforeAll() {
		await super.beforeAll()
		MercuryClientFactory.setDefaultTimeoutMs(2 * 60 * 1000)
	}

	protected static async afterAll() {
		await super.afterAll()

		for (const client of this.clients) {
			await client.disconnect()
		}

		this.clients = []
		MercuryClientFactory.reset()
	}

	protected static async Client(
		options?: Partial<ConnectionOptions>
	): Promise<Client> {
		const { host = TEST_HOST, ...rest } = options || {}

		const client = await MercuryClientFactory.Client({
			host,
			contracts: coreEventContracts as any,
			reconnectDelayMs: 10,
			emitTimeoutMs: 10000,
			...rest,
		})

		this.clients.push(client)

		return client
	}

	protected static async loginAsDemoPerson(
		phone = process.env.DEMO_PHONE
	): Promise<{
		person: Person
		client: Client
		token: string
	}> {
		const client = await this.Client()

		if (!phone) {
			throw new SchemaError({
				code: 'MISSING_PARAMETERS',
				parameters: ['env.DEMO_PHONE'],
			})
		}

		const requestPinResults = await client.emit('request-pin::v2020_12_25', {
			payload: {
				phone,
			},
		})

		const { challenge } =
			eventResponseUtil.getFirstResponseOrThrow(requestPinResults)

		assert.isTruthy(challenge)

		const confirmPinResults = await client.emit('confirm-pin::v2020_12_25', {
			payload: {
				challenge,
				pin: phone.substr(-4),
			},
		})

		const { person, token } =
			eventResponseUtil.getFirstResponseOrThrow(confirmPinResults)

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

		const { organization } =
			eventResponseUtil.getFirstResponseOrThrow(orgResults)

		assert.isTruthy(organization)

		return organization
	}

	protected static async seedInstallAndLoginAsSkill(
		client: Client,
		org: Organization
	) {
		const skill = await this.seedAndInstallDummySkill(client, org)

		const skillClient = await this.Client()
		await skillClient.authenticate({
			skillId: skill.id,
			apiKey: skill.apiKey,
		})

		return { skill, client: skillClient }
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
