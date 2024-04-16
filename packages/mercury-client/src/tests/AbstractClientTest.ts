import { coreEventContracts } from '@sprucelabs/mercury-core-events'
import { EventContract } from '@sprucelabs/mercury-types'
import { SpruceSchemas } from '@sprucelabs/mercury-types'
import { SchemaError } from '@sprucelabs/schema'
import { eventResponseUtil } from '@sprucelabs/spruce-event-utils'
import AbstractSpruceTest, { assert } from '@sprucelabs/test'
import MercuryClientFactory from '../clients/MercuryClientFactory'
import MutableContractClient from '../clients/MutableContractClient'
import { ConnectionOptions, MercuryClient } from '../types/client.types'
import { TEST_HOST } from './constants'

type Client = MercuryClient
type Person = SpruceSchemas.Spruce.v2020_07_22.Person

export default class AbstractClientTest extends AbstractSpruceTest {
    private static dummySkillCount = 0
    protected static clients: Client[] = []
    protected static skillName = 'Dummy skill'

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

    protected static async connectToApi(
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
        const client = await this.connectToApi()

        if (!phone) {
            throw new SchemaError({
                code: 'MISSING_PARAMETERS',
                parameters: ['env.DEMO_PHONE'],
            })
        }

        const requestPinResults = await client.emit(
            'request-pin::v2020_12_25',
            {
                payload: {
                    phone,
                },
            }
        )

        const { challenge } =
            eventResponseUtil.getFirstResponseOrThrow(requestPinResults)

        assert.isTruthy(challenge)

        const confirmPinResults = await client.emit(
            'confirm-pin::v2020_12_25',
            {
                payload: {
                    challenge,
                    pin: phone.substr(-4),
                },
            }
        )

        const { person, token } =
            eventResponseUtil.getFirstResponseOrThrow(confirmPinResults)

        assert.isTruthy(person, 'Failed to login!')

        return { person, client, token }
    }

    protected static async seedDummyOrg(client: Client) {
        const orgName = `Dummy org ${new Date().getTime()}`
        const orgResults = await client.emit(
            'create-organization::v2020_12_25',
            {
                payload: {
                    name: orgName,
                },
            }
        )

        const { organization } =
            eventResponseUtil.getFirstResponseOrThrow(orgResults)

        assert.isTruthy(organization)

        return organization
    }

    protected static async seedInstallAndLoginAsSkill(
        client: Client,
        orgId: string
    ) {
        const skill = await this.seedAndInstallDummySkill(client, orgId)

        const skillClient = await this.connectToApi()
        await skillClient.authenticate({
            skillId: skill.id,
            apiKey: skill.apiKey,
        })

        return { skill, client: skillClient }
    }

    protected static async seedAndInstallDummySkill(
        client: Client,
        orgId: string
    ) {
        const skill = await this.seedDemoSkill(client)

        const installResults = await client.emit('install-skill::v2020_12_25', {
            target: {
                organizationId: orgId,
            },
            payload: { skillId: skill.id },
        })

        assert.isEqual(installResults.totalErrors, 0)

        return skill
    }

    protected static async seedDemoSkill(client: Client) {
        const skill1Results = await client.emit('register-skill::v2020_12_25', {
            payload: {
                name: `${this.skillName} ${++this.dummySkillCount} ${
                    new Date().getTime() * Math.random()
                }`,
            },
        })

        const skill = skill1Results.responses[0].payload?.skill
        assert.isTruthy(skill)
        return skill
    }

    protected static async registerEvent(
        namespace: string,
        client: MercuryClient
    ) {
        const sig = this.generateWillSendVipEventSignature(namespace)

        MutableContractClient.mixinContract(sig)

        const registerResults = await client.emit(
            'register-events::v2020_12_25',
            {
                payload: {
                    contract: this.generateWillSendVipEventSignature(),
                },
            }
        )

        eventResponseUtil.getFirstResponseOrThrow(registerResults)

        return sig
    }

    protected static generateWillSendVipEventSignature(
        slug?: string
    ): EventContract {
        const contract: EventContract = {
            eventSignatures: {
                [`${slug ? `${slug}.` : ''}will-send-vip::v1`]: {
                    emitPayloadSchema: {
                        id: 'willSendVipTargetAndPayload',
                        fields: {
                            target: {
                                type: 'schema',
                                isRequired: true,
                                options: {
                                    schema: {
                                        id: 'willSendVipTarget',
                                        fields: {
                                            organizationId: {
                                                type: 'text',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    responsePayloadSchema: {
                        id: 'testEventResponsePayload',
                        fields: {
                            messages: {
                                type: 'text',
                                isArray: true,
                                isRequired: true,
                            },
                        },
                    },
                },
            },
        }

        return contract
    }
}
