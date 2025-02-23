import { coreEventContracts } from '@sprucelabs/mercury-core-events'
import {
    EventContract,
    buildPermissionContract,
    SpruceSchemas,
} from '@sprucelabs/mercury-types'
import { Location } from '@sprucelabs/spruce-core-schemas'
import {
    buildEmitTargetAndPayloadSchema,
    eventAssertUtil,
    eventResponseUtil,
} from '@sprucelabs/spruce-event-utils'
import { test, assert, generateId } from '@sprucelabs/test-utils'
import { errorAssert } from '@sprucelabs/test-utils'
import { MercuryClientFactory, MercuryTestClient } from '../..'
import SpruceError from '../../errors/SpruceError'
import AbstractClientTest from '../../tests/AbstractClientTest'
import {
    DEMO_PHONE_GUEST,
    DEMO_PHONE_TEAMMATE,
    TEST_HOST,
} from '../../tests/constants'
import { MercuryClient } from '../../types/client.types'

export default class SimulatingEventsForTestingTest extends AbstractClientTest {
    private static readonly eventName = 'whoami::v2020_12_25'
    private static readonly testEventName = 'my-skill.test-event::v2020_02_02'

    protected static async beforeEach() {
        await super.beforeEach()
        MercuryTestClient.setShouldRequireLocalListeners(false)
    }

    @test()
    protected static testModeFalseByDefault() {
        assert.isFalse(MercuryClientFactory.isInTestMode())
    }

    @test()
    protected static async canSetTestMode() {
        this.enableTestMode()
        assert.isTrue(MercuryClientFactory.isInTestMode())
    }

    @test()
    protected static async testClientHandlesDefaultContracts() {
        const client = await this.connectToApiAsTestClient(true)

        assert.isTrue(client.doesHandleEvent(this.eventName))
        assert.isFalse(client.doesHandleEvent('taco-bravo'))

        await client.disconnect()
    }

    @test()
    protected static async clientKnowsIfIsTestClient() {
        MercuryClientFactory.setIsTestMode(false)

        const client = await MercuryClientFactory.Client({
            host: TEST_HOST,
            allowSelfSignedCrt: true,
        })

        assert.isFalse(client.getIsTestClient())

        this.enableTestMode()

        const client2 = await MercuryClientFactory.Client({
            host: TEST_HOST,
            allowSelfSignedCrt: true,
        })

        assert.isTrue(client2.getIsTestClient())

        await client.disconnect()
    }

    @test('can emit to self with default contract', true)
    @test('can emit to self without default contract', false)
    protected static async canEmitEventToSelfForTesting(
        shouldSetDefaultContract: boolean
    ) {
        const client = await this.connectToApiAsTestClient(
            shouldSetDefaultContract
        )
        let wasFired = false

        await client.on('did-message::v2020_12_25', async () => {
            wasFired = true
        })

        await client.emit('did-message::v2020_12_25', {
            target: {},
            payload: {
                message: {
                    id: 'test',
                    source: {},
                    target: {},
                    body: 'message body',
                    classification: 'incoming',
                    dateCreated: 1,
                },
            },
        })

        assert.isTrue(wasFired)
    }

    @test()
    protected static async canEmitToApiWhenNoLocalListenerIsSet() {
        const client = await this.connectToApiAsTestClient()
        const results = await client.emit('get-event-contracts::v2020_12_25')

        const { contracts } = eventResponseUtil.getFirstResponseOrThrow(results)

        assert.isArray(contracts)
        assert.isObject(contracts[0])
        assert.isObject(
            contracts[0].eventSignatures['get-event-contracts::v2020_12_25']
        )
    }

    @test()
    protected static async canHandleRapidFireConnectsToApi() {
        const client = await this.connectToApiAsTestClient()
        await Promise.all([
            client.emit('get-event-contracts::v2020_12_25'),
            client.emit('get-event-contracts::v2020_12_25'),
            client.emit('get-event-contracts::v2020_12_25'),
        ])
    }

    @test()
    protected static async canEmitToSelfUsingToClients() {
        const [client1, client2] = await Promise.all([
            this.connectToApiAsTestClient(),
            this.connectToApiAsTestClient(),
        ])

        let wasFired = false

        await client1.on('did-message::v2020_12_25', async () => {
            wasFired = true
        })

        await client2.emit('did-message::v2020_12_25', {
            target: {},
            payload: {
                message: {
                    id: 'test',
                    source: {},
                    target: {},
                    body: 'message body',
                    classification: 'incoming',
                    dateCreated: 1,
                },
            },
        })

        assert.isTrue(wasFired)
    }

    @test()
    protected static async factoryReturnsSocketIoClient() {
        const client = await this.connectToApiAsTestClient()

        assert.isTrue(client.isConnected())

        await client.disconnect()

        assert.isFalse(client.isConnected())
    }

    @test()
    protected static async canResetClient() {
        const client = await this.connectToApiAsTestClient()

        MercuryTestClient.reset()
        const err = await assert.doesThrowAsync(() =>
            client.on('did-message::v2020_12_25', async () => {})
        )

        errorAssert.assertError(err, 'INVALID_EVENT_NAME')
    }

    @test()
    protected static async canMixinContractsToTestClient() {
        const [client1, client2] = await Promise.all([
            this.connectToApiAsTestClient(),
            this.connectToApiAsTestClient(),
        ])

        this.mixinPayloadLessTestEvent(client1)

        let hit = false

        //@ts-ignore
        await client2.on(this.testEventName, () => {
            hit = true
        })

        //@ts-ignore
        await client1.emit(this.testEventName)

        assert.isTruthy(hit)
    }

    @test()
    protected static async firstTestClientAddsEventToSecondTestClient() {
        const client1 = await this.connectToApiAsTestClient(false, {
            eventSignatures: {
                'my-new-event': {},
            },
        })
        const client2 = await this.connectToApiAsTestClient()

        assert.isTrue(client1.doesHandleEvent('my-new-event'))
        assert.isTrue(client2.doesHandleEvent('my-new-event'))
    }

    @test()
    protected static async secondTestClientAddsEventToFirstTestClient() {
        const client1 = await this.connectToApiAsTestClient()
        const client2 = await this.connectToApiAsTestClient(false, {
            eventSignatures: {
                'my-new-event': {},
            },
        })

        assert.isTrue(client1.doesHandleEvent('my-new-event'))
        assert.isTrue(client2.doesHandleEvent('my-new-event'))
    }

    @test()
    protected static async includesSourceInEventsEmittedByPerson() {
        const [client2, { client: client1, person }] = await Promise.all([
            this.connectToApiAsTestClient(),
            this.loginAsDemoPerson(),
        ])

        this.mixinPayloadLessTestEvent(client1)

        let s: any

        //@ts-ignore
        await client2.on(this.testEventName, ({ source }) => {
            s = source
        })

        //@ts-ignore
        await client1.emit(this.testEventName)

        assert.isTruthy(s.personId)
        assert.isEqual(s.personId, person.id)
        assert.isUndefined(s.skillId)
    }

    @test('does not check permissions by default', false)
    @test('does check permissions by default if array is empty', true)
    protected static async doesCheckPermsIfPermissionsIsEmptyArrayOnContract(
        expected: boolean
    ) {
        MercuryTestClient.setShouldCheckPermissionsOnLocalEvents(expected)

        const [client2, { client: client1 }] = await Promise.all([
            this.connectToApiAsTestClient(),
            this.loginAsDemoPerson(),
        ])

        const contract: EventContract = {
            eventSignatures: {
                [this.testEventName]: {
                    isGlobal: true,
                    emitPermissionContract: {
                        id: 'test',
                        name: 'Can emit',
                        permissions: [],
                    },
                    responsePayloadSchema: {
                        id: 'response',
                        fields: {
                            hit: {
                                type: 'boolean',
                            },
                        },
                    },
                },
            },
        }

        client2.mixinContract(contract)

        let wasHit = false
        await client1.on('does-honor-permission-contract::v2020_12_25', () => {
            wasHit = true
            return {
                doesHonor: false,
            }
        })

        let s: any

        //@ts-ignore
        await client1.on(this.testEventName, ({ source }) => {
            s = source
        })

        //@ts-ignore
        const results = await client1.emit(this.testEventName)

        if (expected) {
            assert.isAbove(results.totalErrors, 0)
            assert.isFalsy(s)
        } else {
            assert.isTruthy(s)
            assert.isEqual(results.totalErrors, 0)
        }
        assert.isEqual(wasHit, expected)
    }

    @test()
    protected static async stillValidatesPayloads() {
        const [client1, client2] = await Promise.all([
            this.connectToApiAsTestClient(true),
            this.connectToApiAsTestClient(true),
        ])

        let hit = false
        await client2.on('confirm-pin::v2020_12_25', async () => {
            hit = true
            return {
                token: 'yes!',
                person: {} as any,
            }
        })

        const err = await assert.doesThrowAsync(() =>
            client1.emit('confirm-pin::v2020_12_25', {
                //@ts-ignore
                fails: true,
            })
        )

        errorAssert.assertError(err, 'INVALID_PAYLOAD')

        assert.isFalse(hit)
    }

    @test()
    protected static async includesSourceInEventsEmittedBySkill() {
        const { personClient, skill1Client, skill2Client, skill1 } =
            await this.setupOrgAndInstall2Skills()

        this.mixinPayloadLessTestEvent(personClient)

        let s: any

        //@ts-ignore
        await skill2Client.on(this.testEventName, ({ source }) => {
            s = source
        })

        //@ts-ignore
        await skill1Client.emit(this.testEventName)

        assert.isTruthy(s.skillId)
        assert.isEqual(s.skillId, skill1.id)
        assert.isUndefined(s.personId)
    }

    @test()
    protected static async checksPermissionsWhenEmitting() {
        MercuryTestClient.setShouldCheckPermissionsOnLocalEvents(true)

        const { skill1, skill1Client, skill2Client, org, personClient } =
            await this.setupOrgAndInstall2Skills()

        const eventName = 'event-with-emit-permissions::v2020_05_19'
        const fqen = `${skill1.slug}.event-with-emit-permissions::v2020_05_19`

        const targetWithOrgId = buildEmitTargetAndPayloadSchema({
            eventName,
            targetSchema: {
                id: 'test-target',
                fields: {
                    organizationId: {
                        type: 'id',
                        isRequired: true,
                    },
                },
            },
        })

        //@ts-ignore
        skill1Client.mixinContract({
            eventSignatures: {
                [fqen]: {
                    emitPayloadSchema: targetWithOrgId,
                    emitPermissionContract: this.buildEmitPermContract(),
                },
            },
        })

        const registerEventResults = await skill1Client.emit(
            'register-events::v2020_12_25',
            {
                payload: {
                    contract: {
                        eventSignatures: {
                            [eventName]: {
                                emitPayloadSchema: targetWithOrgId,
                                emitPermissionContract:
                                    this.buildEmitPermContract(),
                            },
                        },
                    },
                },
            }
        )

        eventResponseUtil.getFirstResponseOrThrow(registerEventResults)

        await skill1Client.on(fqen as any, async () => {})

        await this.assertGuestCantEmit(fqen, org.id)
        await this.assertAnonCantEmit(fqen, org.id)
        await this.assertAnotherSkillCantEmit(fqen, skill2Client, org.id)
        await this.assertTeammateCanEmit({
            fqen,
            ownerClient: personClient,
            organizationId: org.id,
        })
    }

    @test()
    protected static async localResponsesAreValidated() {
        const [client1, client2] = await Promise.all([
            this.connectToApiAsTestClient(true),
            this.connectToApiAsTestClient(true),
        ])

        //@ts-ignore
        await client2.on('confirm-pin::v2020_12_25', async () => {
            return {
                token: 'yes!',
                taco: {} as any,
            }
        })

        const results = await client1.emit('confirm-pin::v2020_12_25', {
            payload: {
                challenge: '1234',
                pin: '0000',
            },
        })

        assert.isEqual(results.totalErrors, 1)
        eventAssertUtil.assertErrorFromResponse(
            results,
            'INVALID_RESPONSE_PAYLOAD'
        )
    }

    @test()
    protected static async responseThrowingAnErrorIsPassedThrough() {
        const [client1, client2] = await Promise.all([
            this.connectToApiAsTestClient(true),
            this.connectToApiAsTestClient(true),
        ])

        //@ts-ignore
        await client2.on('confirm-pin::v2020_12_25', async () => {
            //@ts-ignore
            throw new SpruceError({ code: 'TEST' })
        })

        const results = await client1.emit('confirm-pin::v2020_12_25', {
            payload: {
                challenge: '1234',
                pin: '0000',
            },
        })

        assert.isEqual(results.totalErrors, 1)
        eventAssertUtil.assertErrorFromResponse(results, 'TEST')
    }

    @test()
    protected static async testClientWrapsUnknownEventNameInHelpfulDebugError() {
        const client = await this.connectToApiAsTestClient(true)

        //@ts-ignore
        const err = await assert.doesThrowAsync(() => client.emit('waka-waka'))

        assert.doesInclude(err.message, 'spruce create.event')
    }

    @test()
    protected static async returnsHelpfulErrorIfEventExistsLocallyButNotRemotely() {
        const client = await this.connectToApiAsTestClient(true)

        MercuryTestClient.getInternalEmitter().mixinContract({
            eventSignatures: {
                ['waka-waka']: {},
            },
        })

        //@ts-ignore
        const results = await client.emit('waka-waka')

        const err = eventAssertUtil.assertErrorFromResponse(
            results,
            'INVALID_EVENT_NAME'
        )

        assert.doesInclude(err.message, 'create.listener')
    }

    @test()
    protected static async passesThroughProxyIfSetOnClient() {
        const { personClient, skill1Client, skill2Client, skill1 } =
            await this.setupOrgAndInstall2Skills()

        this.mixinPayloadLessTestEvent(personClient)

        let s: any

        //@ts-ignore
        await skill2Client.on(this.testEventName, ({ source }) => {
            s = source
        })

        const proxyToken = 'toast-cheese'
        skill1Client.setProxyToken(proxyToken)

        //@ts-ignore
        await skill1Client.emit(this.testEventName)

        assert.isTruthy(s.skillId)
        assert.isEqual(s.skillId, skill1.id)
        assert.isUndefined(s.personId)
        assert.isEqual(s.proxyToken, proxyToken)
    }

    @test()
    protected static async passesThroughProxyIfSentWithPayload() {
        const { personClient, skill1Client, skill2Client, skill1 } =
            await this.setupOrgAndInstall2Skills()

        this.mixinPayloadLessTestEventWithSource(personClient)

        let s: any

        //@ts-ignore
        await skill2Client.on(this.testEventName, ({ source }) => {
            s = source
        })

        const proxyToken = 'waste-taco'
        skill1Client.setProxyToken('this-should-be-ignored-now')

        //@ts-ignore
        await skill1Client.emit(this.testEventName, {
            source: {
                proxyToken,
            },
        })

        assert.isTruthy(s.skillId)
        assert.isEqual(s.skillId, skill1.id)
        assert.isUndefined(s.personId)
        assert.isEqual(s.proxyToken, proxyToken)
    }

    @test()
    protected static async throwsIfEmitsIsNotGlobalAndTargetDoesNotIncludeOrganizationIdOrLocationId() {
        MercuryTestClient.setShouldCheckPermissionsOnLocalEvents(false)

        const client = await this.connectToApiAsTestClient(true)
        const client2 = await this.connectToApiAsTestClient(true)

        const contract: EventContract = {
            eventSignatures: {
                [this.testEventName]: {
                    emitPermissionContract: {
                        id: 'test',
                        name: 'Can emit',
                        permissions: [],
                    },
                },
            },
        }

        client.mixinContract(contract)

        await client.on(this.testEventName as any, () => {})

        const err = await assert.doesThrowAsync(() =>
            client2.emit(this.testEventName as any)
        )

        errorAssert.assertError(err, 'INVALID_EVENT_SIGNATURE')
    }

    @test()
    protected static async passesThroughTestProxy() {
        this.enableTestMode()

        const { client: teammateClient } =
            await this.loginAsDemoPerson(DEMO_PHONE_TEAMMATE)
        const { client: guestClient } =
            await this.loginAsDemoPerson(DEMO_PHONE_GUEST)

        const client = await this.connectToApiAsTestClient()
        let passedSource: any
        await client.on('whoami::v2020_12_25', async ({ source }) => {
            passedSource = source
            return {} as any
        })

        const teammateToken = await teammateClient.registerProxyToken()
        guestClient.setProxyToken(teammateToken)

        await guestClient.emit('whoami::v2020_12_25')

        assert.isEqual(passedSource.proxyToken, teammateToken)
    }

    @test()
    protected static async proxyNotSentToAuthenticate() {
        const client = await this.enableTestModeAndLoginAsGuest()

        const token = await client.registerProxyToken()

        let passedSource: any

        //@ts-ignore
        await client.on('authenticate::v2020_12_25', ({ source }) => {
            passedSource = source
            return {
                type: 'authenticated',
                auth: {},
            }
        })

        const anon = await this.connectToApiAsTestClient()
        anon.setProxyToken(token)

        await anon.authenticate({
            token: '234234234234',
        })

        assert.isFalsy(passedSource?.proxyToken)
    }

    @test()
    protected static async throwsWhenPassingEmptyTargetAndPayloadToEVentWithNoEmitPayloadSchema() {
        const client = await this.enableTestModeAndLoginAsGuest()

        //@ts-ignore
        delete client.eventContract.eventSignatures['whoami::v2020_12_25']
            .emitPayloadSchema

        await client.on('whoami::v2020_12_25', () => ({
            type: 'anonymous' as const,
            auth: {},
        }))

        await assert.doesThrowAsync(() =>
            client.emit('whoami::v2020_12_25', {})
        )
    }

    @test()
    protected static async callbackInvokedForEachResponse() {
        const client = await this.enableTestModeAndLoginAsGuest()

        await client.on('list-organizations::v2020_12_25', () => {
            return {
                organizations: [],
            }
        })

        let wasHit = false

        await client.emit('list-organizations::v2020_12_25', () => {
            wasHit = true
        })

        assert.isTrue(wasHit)
    }

    @test()
    protected static async fakedResponsesAreCloned() {
        const client = await this.enableTestModeAndLoginAsGuest()
        const org: SpruceSchemas.Spruce.v2020_07_22.Organization = {
            id: '1234',
            name: 'Pal',
            dateCreated: 0,
            slug: 'buddy',
        }

        await client.on('list-organizations::v2020_12_25', () => {
            return {
                organizations: [org],
            }
        })

        const [{ organizations }] = await client.emitAndFlattenResponses(
            'list-organizations::v2020_12_25'
        )

        assert.isNotEqual(organizations[0], org)
    }

    @test()
    protected static async offHonorsCb() {
        const client = await this.enableTestModeAndLoginAsGuest()

        let cb1Hit = 0
        let cb2Hit = 0

        const cb1 = () => {
            cb1Hit++
            return {
                type: 'anonymous' as const,
                auth: {},
            }
        }

        const cb2 = () => {
            cb2Hit++
            return {
                type: 'anonymous' as const,
                auth: {},
            }
        }

        await client.on('whoami::v2020_12_25', cb1)
        await client.on('whoami::v2020_12_25', cb2)

        await client.off('whoami::v2020_12_25', cb2)

        await client.emit('whoami::v2020_12_25')

        assert.isEqual(cb1Hit, 1)
        assert.isEqual(cb2Hit, 0)
    }

    @test()
    protected static async canEmitStatusChangeEventForTesting() {
        const client = await this.enableTestModeAndLoginAsGuest()

        let hit = false

        await client.on('connection-status-change', () => {
            hit = true
        })

        await client.emitAndFlattenResponses('connection-status-change', {
            payload: {
                status: 'connected' as const,
            },
        })
        assert.isTrue(hit)
    }

    @test()
    protected static async payloadsAndResponsesAreCloned() {
        const client = await this.enableTestModeAndLoginAsGuest()
        const city = generateId()
        const location1: Location = {
            id: generateId(),
            dateCreated: 0,
            slug: generateId(),
            name: generateId(),
            organizationId: generateId(),
            address: {
                city,
                country: generateId(),
                province: generateId(),
                street1: generateId(),
                zip: generateId(),
            },
        }

        let passedTarget:
            | SpruceSchemas.Mercury.v2020_12_25.GetLocationTarget
            | undefined

        await client.on('get-location::v2020_12_25', ({ target }) => {
            passedTarget = target
            return {
                location: location1,
            }
        })

        const target = {
            locationId: generateId(),
        }
        const [{ location: results }] = await client.emitAndFlattenResponses(
            'get-location::v2020_12_25',
            {
                target,
            }
        )

        results.address.city = 'changed'
        assert.isEqual(city, location1.address.city)
        assert.isNotEqual(results.address, location1.address)
        assert.isNotEqual(passedTarget, target)
    }

    private static async loginAsGuest() {
        const { client } = await this.loginAsDemoPerson(DEMO_PHONE_GUEST)
        return client
    }

    private static async assertTeammateCanEmit(options: {
        fqen: string
        ownerClient: MercuryClient
        organizationId: string
    }) {
        const { fqen, ownerClient, organizationId } = options

        const { person: teammate, client: teammateClient } =
            await this.loginAsDemoPerson(DEMO_PHONE_TEAMMATE)

        const roleResults = await ownerClient.emit('list-roles::v2020_12_25', {
            target: {
                organizationId,
            },
            payload: {
                shouldIncludePrivateRoles: true,
            },
        })

        const { roles } = eventResponseUtil.getFirstResponseOrThrow(roleResults)
        const teammateRole = roles.find((r) => r.base === 'teammate')
        assert.isTruthy(teammateRole)

        try {
            const roleSetResults = await ownerClient.emit(
                'add-role::v2020_12_25',
                {
                    target: {
                        organizationId,
                    },
                    payload: {
                        personId: teammate.id,
                        roleId: teammateRole.id,
                    },
                }
            )
            eventResponseUtil.getFirstResponseOrThrow(roleSetResults)
        } catch {}

        //@ts-ignore
        const response = await teammateClient.emit(fqen as any, {
            target: {
                organizationId,
            },
        })

        eventResponseUtil.getFirstResponseOrThrow(response)
    }

    private static async assertAnotherSkillCantEmit(
        fqen: string,
        skill2Client: any,
        orgId: string
    ) {
        const results = await skill2Client.emit(fqen, {
            target: {
                organizationId: orgId,
            },
        })
        eventAssertUtil.assertErrorFromResponse(results, 'UNAUTHORIZED_ACCESS')
    }

    private static async assertGuestCantEmit(fqen: string, orgId: string) {
        const { client: personClient } =
            await this.loginAsDemoPerson(DEMO_PHONE_GUEST)

        //@ts-ignore
        const response = await personClient.emit(fqen, {
            target: {
                organizationId: orgId,
            },
        })

        eventAssertUtil.assertErrorFromResponse(response, 'UNAUTHORIZED_ACCESS')
    }

    private static async assertAnonCantEmit(fqen: string, orgId: string) {
        const client = await this.connectToApiAsTestClient()

        //@ts-ignore
        const response = await client.emit(fqen, {
            target: {
                organizationId: orgId,
            },
        })

        eventAssertUtil.assertErrorFromResponse(response, 'UNAUTHORIZED_ACCESS')
    }

    private static buildEmitPermContract() {
        return buildPermissionContract({
            name: 'Can emit contract',
            id: 'can-do-something-contract',
            permissions: [
                {
                    id: 'can-create',
                    name: 'Can create',
                    defaults: {
                        teammate: {
                            default: true,
                        },
                    },
                },
            ],
        })
    }

    private static async setupOrgAndInstall2Skills() {
        this.enableTestMode()

        const { client: personClient } = await this.loginAsDemoPerson()

        const org = await this.seedDummyOrg(personClient)
        const { client: skill1Client, skill: skill1 } =
            await this.seedInstallAndLoginAsSkill(personClient, org.id)

        const { client: skill2Client } = await this.seedInstallAndLoginAsSkill(
            personClient,
            org.id
        )

        return { personClient, skill1, skill1Client, skill2Client, org }
    }

    private static async connectToApiAsTestClient(
        shouldSetDefaultContract = false,
        contract?: EventContract
    ) {
        this.enableTestMode()
        shouldSetDefaultContract &&
            MercuryClientFactory.setDefaultContract(
                coreEventContracts[0] as any
            )

        const allContracts = []
        if (!shouldSetDefaultContract) {
            allContracts.push(...coreEventContracts)
        }

        if (contract) {
            allContracts.push(contract as any)
        }

        const client = await MercuryClientFactory.Client({
            host: TEST_HOST,
            contracts: allContracts.length > 0 ? allContracts : undefined,
            allowSelfSignedCrt: true,
        })

        this.clients.push(client)

        return client
    }

    private static mixinPayloadLessTestEvent(client: any) {
        const contract = {
            eventSignatures: {
                [this.testEventName]: {
                    isGlobal: true,
                },
            },
        }

        client.mixinContract(contract)
    }

    private static enableTestMode() {
        MercuryClientFactory.setIsTestMode(true)
    }

    private static mixinPayloadLessTestEventWithSource(client: any) {
        const contract = {
            eventSignatures: {
                [this.testEventName]: {
                    isGlobal: true,
                    emitPayloadSchema: buildEmitTargetAndPayloadSchema({
                        eventName: this.testEventName,
                    }),
                },
            },
        }

        client.mixinContract(contract)
    }

    private static async enableTestModeAndLoginAsGuest() {
        this.enableTestMode()
        const client = await this.loginAsGuest()
        return client
    }
}
