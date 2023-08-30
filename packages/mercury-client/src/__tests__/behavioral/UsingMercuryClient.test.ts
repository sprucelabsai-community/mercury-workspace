import AbstractSpruceError from '@sprucelabs/error'
import {
	eventAssertUtil,
	eventResponseUtil,
} from '@sprucelabs/spruce-event-utils'
import { assert, errorAssert, test } from '@sprucelabs/test-utils'
import MercuryClientFactory from '../../clients/MercuryClientFactory'
import MercurySocketIoClient from '../../clients/MercurySocketIoClient'
import SpruceError from '../../errors/SpruceError'
import AbstractClientTest from '../../tests/AbstractClientTest'
import {
	DEMO_PHONE,
	DEMO_PHONE_PROXY,
	DEMO_PHONE_RECONNECT,
	TEST_HOST,
} from '../../tests/constants'
import { MercuryClient } from '../../types/client.types'

require('dotenv').config()

export default class UsingMercuryClient extends AbstractClientTest {
	private static timeoutClient?: any

	protected static async afterEach() {
		if (this.timeoutClient) {
			this.timeoutClient.socket = null
		}

		await super.afterEach()
	}

	@test()
	protected static async factoryCanCreateClient() {
		assert.isTruthy(MercuryClientFactory.Client)
	}

	@test()
	protected static async allowsEmptyContracts() {
		const client = await MercuryClientFactory.Client({
			host: TEST_HOST,
			allowSelfSignedCrt: true,
		})
		this.clients.push(client)
	}

	@test()
	protected static async factoryClientCountStartsAtZero() {
		assert.isFunction(MercuryClientFactory.getTotalClients)
		assert.isEqual(MercuryClientFactory.getTotalClients(), 0)
		assert.isLength(MercuryClientFactory.getClients(), 0)
		const client = await this.connectToApi()
		assert.isEqual(MercuryClientFactory.getTotalClients(), 1)
		assert.isEqual(MercuryClientFactory.getClients()[0], client)

		const client2 = await this.connectToApi()
		assert.isEqual(MercuryClientFactory.getTotalClients(), 2)
		assert.isEqual(MercuryClientFactory.getClients()[1], client2)
	}

	@test()
	protected static async connectingToBadProtocolThrows() {
		const err = await assert.doesThrowAsync(() =>
			MercuryClientFactory.Client({ host: 'aoeu://tasty.org', contracts: [] })
		)
		errorAssert.assertError(err, 'INVALID_PROTOCOL')
	}

	@test()
	protected static async factoryReturnsSocketIoClient() {
		const client = await this.connectToApi()

		assert.isTruthy(client instanceof MercurySocketIoClient)
		assert.isTrue(client.isConnected())

		await client.disconnect()

		assert.isFalse(client.isConnected())
	}

	@test()
	protected static async throwsWithBadEventName() {
		const client = await this.connectToApi()

		//@ts-ignore
		const err = await assert.doesThrowAsync(() => client.emit('health2'))

		errorAssert.assertError(err, 'INVALID_EVENT_NAME')
	}

	@test()
	protected static async throwsWithHelpfulErrorWithInvalidPayload() {
		const client = await this.connectToApi()

		const err = await assert.doesThrowAsync(() =>
			//@ts-ignore
			client.emit('get-skill::v2020_12_25', { taco: 'true' })
		)

		assert.doesInclude(err.message, 'taco')
	}

	@test()
	protected static async throwsHelpfulErrorWhenCantReachHost() {
		const host = 'https://wontfindthisanywhere.com'

		const err = await assert.doesThrowAsync(() =>
			this.connectToApi({ host, reconnectDelayMs: 10, connectionRetries: 0 })
		)

		errorAssert.assertError(err, 'CONNECTION_FAILED', {
			host,
			statusCode: 503,
		})
	}

	@test()
	protected static async triesToReconnect5TimesMax() {
		const client = await this.connectToApi({ reconnectDelayMs: 100 })

		let count = 0
		//@ts-ignore
		client.connect = () => {
			count++
			throw new SpruceError({
				code: 'CONNECTION_FAILED',
				host: 'no-found',
				statusCode: 305,
			})
		}

		//@ts-ignore
		await assert.doesThrowAsync(() => client.attemptReconnectAfterDelay())

		assert.isEqual(count, 5)
	}

	@test()
	protected static async getsAccessDeniedWhenTryingToListenToUnknownEventAnonymously() {
		const client = await this.connectToApi()
		const err = await assert.doesThrowAsync(() =>
			//@ts-ignore
			client.on('waka-waka', () => {})
		)

		errorAssert.assertError(err, 'UNAUTHORIZED_ACCESS')
	}

	@test()
	protected static async cantEmitEventWithWithInvalidPayload() {
		const client = await this.connectToApi()
		const err = await assert.doesThrowAsync(() =>
			//@ts-ignore
			client.emit('request-pin::v2020_12_25', {})
		)

		errorAssert.assertError(err, 'INVALID_PAYLOAD', {
			eventName: 'request-pin',
		})
	}

	@test()
	protected static async canRunHealthCheck() {
		const client = await this.connectToApi()
		const results = await client.emit('health::v2020_12_25')

		assert.isEqualDeep(results.responses[0].payload, {
			skill: { status: 'passed' },
			mercury: { status: 'passed' },
		})

		await client.disconnect()
	}

	@test()
	protected static async skillsCanListenToEachOther() {
		const { org, skill1, skill1Client, skill2Client } =
			await this.setup2SkillsAndOneEvent()

		let newEventTriggered = false

		//@ts-ignore
		await skill2Client.on(`${skill1.slug}.will-send-vip::v1`, () => {
			newEventTriggered = true
			return {
				messages: ['hello world'],
			}
		})

		const results = await skill1Client.emit(
			//@ts-ignore
			`${skill1.slug}.will-send-vip::v1`,
			{
				target: {
					organizationId: org.id,
				},
			}
		)

		assert.isEqual(results.totalErrors, 0)
		assert.isTrue(newEventTriggered)
	}

	@test()
	protected static async errorsInListenersRetainOptions() {
		//@ts-ignore
		const error = new SpruceError({ code: 'UNKNOWN_ERROR', param: 1, test: 1 })

		const results = await this.setup2Skills1EventAddThrowingListenerAndEmit(
			//@ts-ignore
			error
		)

		assert.isEqual(results.totalErrors, 1)
		eventAssertUtil.assertErrorFromResponse(results, 'UNKNOWN_ERROR', {
			param: 1,
			test: 1,
		})
	}

	@test()
	protected static async retainsGeneratedFriendlyMessage() {
		class TestError extends AbstractSpruceError {
			public friendlyMessage() {
				return 'test this dude!'
			}
		}

		const results = await this.setup2Skills1EventAddThrowingListenerAndEmit(
			//@ts-ignore
			new TestError({ code: 'INVALID_PARAMETERS' })
		)

		//@ts-ignore
		assert.isEqual(results.responses[0].errors[0].message, 'test this dude!')
	}

	@test()
	protected static async nonSpruceErrorsArePassedBackAsListenerErrors() {
		const { org, skill1, skill1Client, skill2Client } =
			await this.setup2SkillsAndOneEvent()

		const fqen = `${skill1.slug}.will-send-vip::v1`
		//@ts-ignore
		await skill2Client.on(fqen, () => {
			throw new Error('oh shoot')
		})

		//@ts-ignore
		const results = await skill1Client.emit(fqen, {
			target: {
				organizationId: org.id,
			},
		})

		assert.isEqual(results.totalErrors, 1)

		const err = eventAssertUtil.assertErrorFromResponse(
			results,
			'LISTENER_ERROR'
		)
		//@ts-ignore
		assert.isEqual(err.options.fqen, fqen)
		assert.doesInclude(results.responses[0].errors?.[0].message, 'oh shoot')
	}

	@test('each listener gets fired')
	@test('each listener gets fired after lost connection', true)
	protected static async emitterGetsCalledBackForEachListener(
		shouldDisconnect = false
	) {
		const { org, client, skill1, skill1Client, skill2Client } =
			await this.setup2SkillsAndOneEvent(DEMO_PHONE_RECONNECT)

		const { client: skill3Client } = await this.seedInstallAndLoginAsSkill(
			client,
			org.id
		)

		const { client: skill4Client } = await this.seedInstallAndLoginAsSkill(
			client,
			org.id
		)

		let listenTriggerCount = 0

		//@ts-ignore
		await skill2Client.on(`${skill1.slug}.will-send-vip::v1`, () => {
			listenTriggerCount++
			return {
				messages: ['hello from skill 2'],
			}
		})

		//@ts-ignore
		await skill3Client.on(`${skill1.slug}.will-send-vip::v1`, () => {
			listenTriggerCount++
			return {
				messages: ['hello from skill 3'],
			}
		})

		//@ts-ignore
		await skill4Client.on(`${skill1.slug}.will-send-vip::v1`, () => {
			listenTriggerCount++
			return {
				messages: ['hello from skill 4'],
			}
		})

		if (shouldDisconnect) {
			//@ts-ignore
			client.socket.disconnect()

			//@ts-ignore
			skill1Client.socket.disconnect()

			//@ts-ignore
			skill2Client.socket.disconnect()

			do {
				await this.wait(1000)
			} while (
				!skill1Client.isConnected() ||
				!skill2Client.isConnected() ||
				!client.isConnected()
			)
		}

		let responseTriggerCount = 0

		await skill1Client.emit(
			//@ts-ignore
			`${skill1.slug}.will-send-vip::v1`,
			{
				//@ts-ignore
				target: {
					organizationId: org.id,
				},
			},
			() => {
				responseTriggerCount++
			}
		)

		assert.isEqual(listenTriggerCount, 3)
		assert.isEqual(responseTriggerCount, 3)
	}

	@test()
	protected static async eachResponseMustFinishBeforeEmitReturns() {
		const { org, client, skill1, skill1Client, skill2Client } =
			await this.setup2SkillsAndOneEvent(DEMO_PHONE_RECONNECT)

		const { client: skill3Client } = await this.seedInstallAndLoginAsSkill(
			client,
			org.id
		)

		//@ts-ignore
		await skill2Client.on(`${skill1.slug}.will-send-vip::v1`, async () => {
			return {
				messages: ['hello from skill 2'],
			}
		})

		//@ts-ignore
		await skill3Client.on(`${skill1.slug}.will-send-vip::v1`, async () => {
			return {
				messages: ['hello from skill 2'],
			}
		})

		let ttl = 1000
		let hitCount = 0
		let wasHit = false

		await skill1Client.emit(
			//@ts-ignore
			`${skill1.slug}.will-send-vip::v1`,
			{
				//@ts-ignore
				target: {
					organizationId: org.id,
				},
			},
			async () => {
				if (!wasHit) {
					wasHit = true
					await new Promise((r) => setTimeout(r, ttl))
				}

				hitCount++
			}
		)

		assert.isEqual(hitCount, 2)
	}

	@test()
	protected static async offRemovesListener() {
		const { org, skill1, skill1Client, skill2Client } =
			await this.setup2SkillsAndOneEvent()

		let listenerTriggerCount = 0

		const eventName = `${skill1.slug}.will-send-vip::v1`

		//@ts-ignore
		await skill2Client.on(eventName, () => {
			listenerTriggerCount++
			return {
				messages: ['hello world'],
			}
		})

		//@ts-ignore
		await skill1Client.emit(eventName, {
			target: {
				organizationId: org.id,
			},
		})

		//@ts-ignore
		const offCount = await skill2Client.off(eventName)
		assert.isEqual(offCount, 1)

		//@ts-ignore
		await skill1Client.emit(eventName, {
			target: {
				organizationId: org.id,
			},
		})

		assert.isEqual(listenerTriggerCount, 1)
	}

	@test()
	protected static async offErrorsWithUnknownEvent() {
		const { skill1Client } = await this.setup2SkillsAndOneEvent()

		const err = await assert.doesThrowAsync(() =>
			//@ts-ignore
			skill1Client.off('event-does-not-exist')
		)

		errorAssert.assertError(err, 'INVALID_EVENT_NAME')
	}

	@test()
	protected static async throwsWhenEmittingWhenNotConnected() {
		const client = await this.connectToApi()
		await client.disconnect()

		const err = await assert.doesThrowAsync(() =>
			client.emit('health::v2020_12_25')
		)

		errorAssert.assertError(err, 'NOT_CONNECTED')
	}

	@test()
	protected static async serverSideErrorsMappedToSpruceErrors() {
		const client = await this.connectToApi()
		const response = await client.emit('register-skill::v2020_12_25', {
			payload: { name: 'test' },
		})
		const errors = response.responses[0].errors

		assert.isTruthy(errors)
		errorAssert.assertError(errors[0], 'UNAUTHORIZED_ACCESS')
	}

	@test('times out when giving up on 1 retry on emit', 1)
	@test('times out when giving up on 5 retries on emit', 5)
	protected static async timesOutWhenEmittingEventThatIsNeverHandled(
		maxEmitRetries: number
	) {
		const client = await this.TimeoutClient(undefined, maxEmitRetries)

		const err = await assert.doesThrowAsync(() =>
			client.emit('register-skill::v2020_12_25', {
				payload: { name: 'test' },
			})
		)

		errorAssert.assertError(err, 'TIMEOUT', {
			eventName: 'register-skill::v2020_12_25',
		})

		assert.isEqual(client.socket.invocationCounts.off, maxEmitRetries + 1)
	}

	@test()
	protected static async timeoutMakesEventualResponseNotCount() {
		const client = await this.TimeoutClient(12000)

		const err = await assert.doesThrowAsync(() =>
			client.emit('register-skill::v2020_12_25', {
				payload: { name: 'test' },
			})
		)

		errorAssert.assertError(err, 'TIMEOUT', {
			eventName: 'register-skill::v2020_12_25',
		})

		await this.wait(4000)

		assert.isEqual(client.socket.invocationCounts.off, 6)
	}

	@test('emit timeouts are reset after each emit with 5 retries', 5)
	@test('emit timeouts are reset after each emit with 3 retries', 3)
	protected static async emitTimeoutsAreResetAfterEmit(maxEmitRetries: number) {
		const client = await this.TimeoutClient(undefined, maxEmitRetries)

		await assert.doesThrowAsync(() =>
			client.emit('register-skill::v2020_12_25', {
				payload: { name: 'test' },
			})
		)

		assert.isEqual(client.socket.invocationCounts.off, maxEmitRetries + 1)
		client.socket.invocationCounts.off = 0

		await assert.doesThrowAsync(() =>
			client.emit('register-skill::v2020_12_25', {
				payload: { name: 'test' },
			})
		)

		assert.isEqual(client.socket.invocationCounts.off, maxEmitRetries + 1)
	}

	@test()
	protected static async emitTimeoutsAreScopedPerEmit() {
		const client = await this.TimeoutClient()

		const promise1 = client.emit('register-skill::v2020_12_25', {
			payload: { name: 'test' },
		})

		const promise2 = client.emit('register-skill::v2020_12_25', {
			payload: { name: 'test' },
		})

		await assert.doesThrowAsync(() => promise1)
		await assert.doesThrowAsync(() => promise2)

		assert.isEqual(client.socket.invocationCounts.off, 12)
	}

	@test()
	protected static async canRegisterEventsSimultaneously() {
		const { client } = await this.loginAsDemoPerson()
		const org = await this.seedDummyOrg(client)

		const { client: originalSkillClient } =
			await this.seedInstallAndLoginAsSkill(client, org.id)

		const eventsToCheck: string[] = []

		await Promise.all(
			new Array(20).fill(0).map(async (_, idx) => {
				this.skillName = `Simultanious skill ${idx}`

				const { skill, client: skillClient } =
					await this.seedInstallAndLoginAsSkill(client, org.id)

				await skillClient.emitAndFlattenResponses(
					'register-events::v2020_12_25',
					{
						payload: {
							contract: this.generateWillSendVipEventSignature(),
						},
					}
				)

				const [{ contracts }] =
					await originalSkillClient.emitAndFlattenResponses(
						'get-event-contracts::v2020_12_25'
					)

				let found = false

				for (const contract of contracts) {
					if (contract.eventSignatures?.[`${skill.slug}.will-send-vip::v1`]) {
						found = true
						break
					}
				}

				assert.isTrue(found)
			})
		)

		const results = await originalSkillClient.emit(
			'get-event-contracts::v2020_12_25'
		)

		const { contracts } = eventResponseUtil.getFirstResponseOrThrow(results)

		do {
			const checking = eventsToCheck[eventsToCheck.length - 1]

			for (const contract of contracts) {
				if (contract.eventSignatures[checking]) {
					eventsToCheck.pop()
					break
				}
			}
		} while (eventsToCheck.length > 0)
	}

	@test()
	protected static async handlesCantEmitElegantly() {
		const client = await this.connectToApi()

		const results = await client.emit('did-message::v2020_12_25', {
			target: {},
			payload: {
				message: {
					id: '13234',
					target: {},
					source: {},
					classification: 'incoming',
					body: 'go team!',
					dateCreated: new Date().getTime(),
				},
			},
		})

		eventAssertUtil.assertErrorFromResponse(results, 'UNAUTHORIZED_ACCESS')
	}

	@test()
	protected static async canDisableAutoRegisterListener() {
		const { org, skill1, skill1Client, skill2Client } =
			await this.setup2SkillsAndOneEvent()

		let listenerTriggerCount = 0

		const eventName = `${skill1.slug}.will-send-vip::v1`

		skill2Client.setShouldAutoRegisterListeners(false)

		//@ts-ignore
		await skill2Client.on(eventName, () => {
			listenerTriggerCount++
			return {
				messages: ['hello world'],
			}
		})

		//@ts-ignore
		await skill1Client.emit(eventName, {
			target: {
				organizationId: org.id,
			},
		})

		assert.isEqual(listenerTriggerCount, 0)
	}

	@test()
	protected static async notAuthenticatedToStart() {
		const client = await this.connectToApi()
		assert.isFalse(client.isAuthenticated())
	}

	@test()
	protected static async knowsWhenAuthenticated() {
		const { client } = await this.loginAsDemoPerson()
		assert.isTrue(client.isAuthenticated())
	}

	@test()
	protected static async noProxyTokenToStart() {
		const client = await this.connectToApi()
		assert.isFalsy(client.getProxyToken())
	}

	@test()
	protected static async canSetProxyToken() {
		const client = await this.connectToApi()
		assert.isFalsy(client.getProxyToken())
		client.setProxyToken('yummy')
		assert.isEqual(client.getProxyToken(), 'yummy')
	}

	@test()
	protected static async requestsAreMadeWithProxyGoingForward() {
		const { client2, token, person1 } = await this.loginAndRegisterToken()

		client2.setProxyToken(token)

		const results = await client2.emit('whoami::v2020_12_25')

		this.assertPerson1ComesBack(results, person1)
	}

	@test()
	protected static async prefersProxyPassedInSource() {
		const { client2, token, person1 } = await this.loginAndRegisterToken()

		client2.setProxyToken('aoeuaoeuaoeu')

		const results = await client2.emit('whoami::v2020_12_25', {
			source: {
				proxyToken: token,
			},
		})

		this.assertPerson1ComesBack(results, person1)
	}

	private static assertPerson1ComesBack(results: any, person1: any) {
		const { auth } = eventResponseUtil.getFirstResponseOrThrow(results)

		assert.isTruthy(auth.person)
		assert.isEqual(auth.person.id, person1.id)
	}

	private static async loginAndRegisterToken() {
		const { client: client1, person: person1 } =
			await this.loginAsDemoPerson(DEMO_PHONE)
		const { client: client2 } = await this.loginAsDemoPerson(DEMO_PHONE_PROXY)

		const results = await client1.emit('register-proxy-token::v2020_12_25')

		const { token } = eventResponseUtil.getFirstResponseOrThrow(results)

		return { client2, token, person1 }
	}

	private static async TimeoutClient(
		emitDelay?: number,
		maxEmitRetries?: number
	): Promise<any> {
		const client = await this.connectToApi({
			emitTimeoutMs: 100,
			shouldReconnect: false,
			maxEmitRetries,
		})

		//@ts-ignore
		const socket = client.socket as any

		await new Promise((resolve) => {
			socket?.once('disconnect', () => {
				socket?.removeAllListeners()
				resolve(undefined)
			})

			socket?.disconnect()
		})

		//@ts-ignore
		client.socket = {
			connected: true,
			invocationCounts: {
				off: 0,
			},
			emit: (_: any, __: any, cb: () => void) => {
				if (emitDelay && emitDelay > 0) {
					setTimeout(cb, emitDelay)
				}
			},
			on: () => {},
			off() {
				this.invocationCounts.off++
			},
			once: () => {},
			disconnect: () => {},
		}

		this.timeoutClient = client

		return client
	}

	private static async setup2Skills1EventAddThrowingListenerAndEmit(
		error: any
	) {
		const { org, skill1, skill1Client, skill2Client } =
			await this.setup2SkillsAndOneEvent()

		//@ts-ignore
		await this.throwOnWillSendVip(skill2Client, skill1.slug, error)

		const results = await skill1Client.emit(
			//@ts-ignore
			`${skill1.slug}.will-send-vip::v1`,
			{
				target: {
					organizationId: org.id,
				},
			}
		)
		return results
	}

	private static async throwOnWillSendVip(
		client: MercuryClient,
		namespace: string,
		error: SpruceError
	) {
		//@ts-ignore
		await client.on(`${namespace}.will-send-vip::v1`, () => {
			//@ts-ignore
			throw error
		})
	}

	private static async setup2SkillsAndOneEvent(phone?: string) {
		const { client } = await this.loginAsDemoPerson(phone)
		const org = await this.seedDummyOrg(client)

		const createLogin = this.seedInstallAndLoginAsSkill(client, org.id)
		const createLogin2 = this.seedInstallAndLoginAsSkill(client, org.id)

		const { skill: skill1, client: skill1Client } = await createLogin

		const { client: skill2Client } = await createLogin2

		await this.registerEvent(skill1.slug, skill1Client)

		return { client, org, skill1, skill1Client, skill2Client }
	}
}
