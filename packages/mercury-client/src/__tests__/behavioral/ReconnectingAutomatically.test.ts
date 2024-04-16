import { eventResponseUtil } from '@sprucelabs/spruce-event-utils'
import { assert, errorAssert, test } from '@sprucelabs/test-utils'
import { Socket } from 'socket.io-client'
import MercuryClientFactory from '../../clients/MercuryClientFactory'
import MercurySocketIoClient from '../../clients/MercurySocketIoClient'
import MercuryTestClient from '../../clients/MercuryTestClient'
import MutableContractClient from '../../clients/MutableContractClient'
import { ConnectionStatus } from '../../clients/statusChangePayloadSchema'
import AbstractClientTest from '../../tests/AbstractClientTest'
import { ConnectionOptions, MercuryClient } from '../../types/client.types'

export default class ReconnectingAutomaticallyTest extends AbstractClientTest {
    private static lastSocket?: ReservedEmittingSocket
    protected static async beforeEach() {
        await super.beforeEach()
        MercuryClientFactory.setIsTestMode(false)
        MercuryTestClient.setShouldRequireLocalListeners(false)
        this.lastSocket = undefined
    }

    @test()
    protected static async invokesReconnectAfterDelayWhenConnectionLost() {
        const client = await this.ClientZeroDelay()

        let wasHit = false

        //@ts-ignore
        client.attemptReconnectAfterDelay = () => {
            wasHit = true
        }

        //@ts-ignore
        client.socket.emitReserved('connect_error', new Error('fail'))

        assert.isTrue(wasHit)
    }

    @test()
    protected static async reconnectsWhenEmittingEventWhenDisconnected() {
        const client = await this.ClientZeroDelay()

        //@ts-ignore
        client.socket.disconnect()

        await this.wait(100)

        const results = await client.emit('whoami::v2020_12_25')

        eventResponseUtil.getFirstResponseOrThrow(results)
    }

    @test()
    protected static async shouldThrowWhenEmittingAfterManualDisconnect() {
        const client = await this.ClientZeroDelay()

        await client.disconnect()

        await assert.doesThrowAsync(
            () => client.emit('whoami::v2020_12_25'),
            'after you have manually disconnected'
        )
    }

    @test()
    protected static async retriesEventIfItFailsAfterTimeout() {
        await this.assertRetriesEmitOnDisconnect()
    }

    @test()
    protected static async retriesEventIfItFailsAfterTimeoutWithTestClient() {
        MercuryClientFactory.setIsTestMode(true)
        await this.assertRetriesEmitOnDisconnect()
    }

    @test.skip('when you have some strength, bring this back and fix')
    protected static async timingOutDuringAuthDoesntThrowAuthBlockedError() {
        const client = await this.connectToApi({ emitTimeoutMs: 1 })

        const err = await assert.doesThrowAsync(() =>
            client.authenticate({ token: 'duh' })
        )

        errorAssert.assertError(err, 'TIMEOUT')
    }

    @test()
    protected static async manuallyDisconnectStopsReconnectAttempts() {
        const client = await this.connectToApi()

        //@ts-ignore
        client.host = 'https://wontwork.workwont'

        //@ts-ignore
        void client.socket.disconnect()

        await this.wait(10)

        await client.disconnect()

        await this.wait(1000)

        //@ts-ignore
        assert.isFalse(client.isReconnecting)
    }

    @test('can set connection retries 1', 1)
    @test('can set connection retries 2', 2)
    protected static async canSetConnectionRetries(retries: number) {
        const client = await this.connectToApi({ connectionRetries: retries })
        //@ts-ignore
        assert.isEqual(client.connectionRetries, retries)
    }

    @test()
    protected static async failingToConnectAtFirstReturnsClientFromOriginalConnection() {
        const connectionErrorSocket = new ConnectionErrorSocket()
        const successSocket = new SuccessSocket()
        const sockets = [connectionErrorSocket, successSocket]

        MercurySocketIoClient.io = function () {
            return sockets.shift()!
        }

        const promise = this.connectToApi()

        await this.wait(1000)

        connectionErrorSocket.emitConnectionError()

        await this.wait(1000)

        successSocket.emitConnect()

        await promise
    }

    @test()
    protected static async canAddStatusChangeListener() {
        const { client, socket } = await this.connectWithEmittingSocket()

        const passedStatuses: string[] = []

        await client.on('connection-status-change', ({ payload }) => {
            passedStatuses.push(payload.status)
        })

        this.patchMercuryEmitToThrow(client)

        socket.emitDisconnect()

        await this.wait(10)

        assert.isEqualDeep(passedStatuses, ['disconnected', 'connecting'])
    }

    @test()
    protected static async canAddMultipleStatusChangeListeners() {
        let { client, socket } = await this.connectWithEmittingSocket()

        let hitCount = 0

        await client.on('connection-status-change', ({ payload }) => {
            if (payload.status === 'disconnected') {
                hitCount++
            }
        })

        await client.on('connection-status-change', ({ payload }) => {
            if (payload.status === 'disconnected') {
                hitCount++
            }
        })

        socket.emitDisconnect()

        await this.wait(10)

        assert.isEqual(hitCount, 2)
    }

    @test()
    protected static async emitsStatusChangeForAttemptingReconnect() {
        let { client } = await this.connectWithEmittingSocket()

        let passedStatuses: string[] = []

        await client.on('connection-status-change', ({ payload }) => {
            passedStatuses.push(payload.status)
        })

        //@ts-ignore
        const promise = client.attemptReconnectAfterDelay(0)

        assert.isEqualDeep(passedStatuses, ['disconnected'])

        await promise

        assert.isEqualDeep(passedStatuses, [
            'disconnected',
            'connecting',
            'connected',
        ])
    }

    @test('retrying to connect emits status change', 10)
    protected static async emitRetriesTracksAccurately(retries: number) {
        const startingRetries = retries
        const { client } = await this.connectWithEmittingSocket({
            connectionRetries: retries,
        })

        this.disableConnect()
        this.emitDisconnect()

        retries = await this.waitAndAssertRetriesDecrement(retries, client)

        this.emitConnectError()

        retries = await this.waitAndAssertRetriesDecrement(retries, client)

        this.emitConnectError()

        await this.waitAndAssertRetriesDecrement(retries, client)

        this.enableConnect()

        this.emitConnect()

        await this.wait(1000)

        assert.isEqual(client.connectionRetriesRemaining, startingRetries)

        await client.disconnect()
    }

    @test()
    protected static async emitsConnectAfterReconnectReRegisterProxyAndListeners() {
        const client = await this.connectAsProxySpy()

        const statuses: (ConnectionStatus | 'proxy' | 'listeners')[] = []
        await client.on('connection-status-change', ({ payload }) => {
            statuses.push(payload.status)
        })

        client.setShouldRegisterProxyOnReconnect(true)
        await client.connect()

        assert.isEqualDeep(statuses, ['connecting', 'connected'])

        client.connect = async () => {}
        client.registerProxyToken = async () => {
            statuses.push('proxy')
        }
        //@ts-ignore
        client.reRegisterAllListeners = async () => {
            statuses.push('listeners')
        }

        await client.reconnect(
            () => {},
            () => {},
            10
        )

        assert.isEqualDeep(statuses, [
            'connecting',
            'connected',
            'proxy',
            'listeners',
            'connected',
        ])
    }

    @test()
    protected static async onlyEmitsConnectedOnceWhenReconnecting() {
        const { client } = await this.connectWithEmittingSocket({
            reconnectDelayMs: 10,
            connectionRetries: 99,
        })

        let statuses: ConnectionStatus[] = []

        await this.disableConnectAndSendMultipleConnectErrors()

        await client.on('connection-status-change', ({ payload }) => {
            statuses.push(payload.status)
        })

        let authCount = 0
        //@ts-ignore
        client.lastAuthOptions = true
        //@ts-ignore
        client.authenticate = async () => {
            authCount++
        }

        await this.enableAndEmitConnect()

        assert.isEqualDeep(statuses, ['connected'])

        await this.disableConnectAndSendMultipleConnectErrors()

        statuses = []
        await this.enableAndEmitConnect()

        assert.isEqualDeep(statuses, ['connected'])
        assert.isEqual(authCount, 2)
    }

    private static async enableAndEmitConnect() {
        this.enableConnect()
        this.emitConnect()
        await this.wait(1000)
    }

    private static async disableConnectAndSendMultipleConnectErrors() {
        this.disableConnect()
        this.emitDisconnect()

        await this.wait(10)
        this.emitConnectError()
        await this.wait(10)
        this.emitConnectError()
        await this.wait(10)
        this.emitConnectError()
        await this.wait(10)
        this.emitConnectError()
        await this.wait(10)
    }

    private static async connectAsProxySpy() {
        MercuryClientFactory.ClientClass = ProxySpyClient as any
        const client = (await this.connectToApi()) as ProxySpyClient
        return client
    }

    private static emitConnect() {
        this.lastSocket?.emitConnect()
    }

    private static enableConnect() {
        this.lastSocket?.enableConnect()
    }

    private static emitConnectError() {
        this.lastSocket?.emitConnectionError()
    }

    private static emitDisconnect() {
        this.lastSocket?.emitDisconnect()
    }

    private static disableConnect() {
        this.lastSocket?.disableConnect()
    }

    private static async waitAndAssertRetriesDecrement(
        retries: number,
        client: ClientWithConnectionAttempts
    ) {
        await this.wait(100)
        retries--
        assert.isEqual(client.connectionRetriesRemaining, retries)
        return retries
    }

    private static async connectWithEmittingSocket(
        options?: Partial<ConnectionOptions>
    ) {
        MercurySocketIoClient.io = ((options: any, args: any) => {
            this.lastSocket = new ReservedEmittingSocket(options, args)
            setTimeout(() => this.lastSocket?.emitConnect(), 1)
            return this.lastSocket
        }) as any

        const client = (await this.connectToApi({
            shouldReconnect: true,
            ...options,
        })) as ClientWithConnectionAttempts
        assert.isTruthy(this.lastSocket)
        return { client, socket: this.lastSocket }
    }

    private static async ClientZeroDelay() {
        return await this.connectToApi({ reconnectDelayMs: 0 })
    }

    private static async assertRetriesEmitOnDisconnect() {
        const client = await this.ClientZeroDelay()

        const promise = client.emit('whoami::v2020_12_25')

        await this.wait(1000)

        //@ts-ignore
        client.socket.disconnect()

        await this.wait(100)

        const results = await promise

        eventResponseUtil.getFirstResponseOrThrow(results)
    }

    private static patchMercuryEmitToThrow(client: any) {
        //@ts-ignore
        client._emit = () => {
            assert.fail('should not be called on local events')
        }
    }
}

class ConnectionErrorSocket extends Socket {
    public constructor() {
        super({} as any, {} as any)
    }
    public connect(): this {
        return this
    }

    public emitConnectionError() {
        this.emitReserved('connect_error', new Error('fail'))
    }
}

class SuccessSocket extends Socket {
    public constructor() {
        super({} as any, {} as any)
    }
    public connect(): this {
        return this
    }

    public emitConnect() {
        this.emitReserved('connect')
    }
}

class ReservedEmittingSocket extends Socket {
    private static shouldAllowConnect = true

    public constructor(options: any, args: any) {
        super(options, args)
    }

    public connect(): this {
        return this
    }

    public disableConnect() {
        ReservedEmittingSocket.shouldAllowConnect = false
    }

    public enableConnect() {
        ReservedEmittingSocket.shouldAllowConnect = true
    }

    public emitReserved(event: string, ...args: any[]) {
        if (event === 'connect' && !ReservedEmittingSocket.shouldAllowConnect) {
            return this
        }
        return super.emitReserved(event as any, ...args)
    }

    public emitConnectionError() {
        this.emitReserved('connect_error', new Error('connection error'))
    }

    public emitConnect() {
        this.emitReserved('connect')
    }

    public emitDisconnect() {
        this.emitReserved('disconnect', 'io client disconnect')
    }
}

type ClientWithConnectionAttempts = MercuryClient & {
    connectionRetriesRemaining: number
}

class ProxySpyClient extends MutableContractClient<any> {
    public setShouldRegisterProxyOnReconnect(should: boolean) {
        this.shouldRegisterProxyOnReconnect = should
    }

    public async reconnect(
        resolve: any,
        reject: any,
        retriesLeft: number
    ): Promise<void> {
        return super.reconnect(resolve, reject, retriesLeft)
    }
}
