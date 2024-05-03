import EventEmitter from 'events'
import { EventName } from '@sprucelabs/mercury-types'
import { test, assert } from '@sprucelabs/test-utils'
import MercuryClientFactory from '../../clients/MercuryClientFactory'
import MercurySocketIoClient from '../../clients/MercurySocketIoClient'
import MercuryTestClient from '../../clients/MercuryTestClient'
import AbstractClientTest from '../../tests/AbstractClientTest'
import { MercuryClient } from '../../types/client.types'

export default class TurningOffAListenerTest extends AbstractClientTest {
    private static client: MercuryClient
    private static fqen: EventName

    private static emptyResponse = {
        responses: [],
    }

    protected static async beforeEach(): Promise<void> {
        await super.beforeEach()
        MercuryClientFactory.setIsTestMode(false)
        this.fqen = 'whoami::v2020_12_25'
    }

    @test()
    protected static async canTurnOffListenerInTests() {
        MercuryClientFactory.setIsTestMode(true)
        MercuryTestClient.setShouldRequireLocalListeners(false)

        await this.connect()
        await this.emit()

        let hitCount = 0

        await this.on(() => {
            hitCount++
            return this.emptyResponse
        })

        await this.emit()

        assert.isEqual(hitCount, 1)

        await this.off()

        await this.emit()

        assert.isEqual(hitCount, 1)
    }

    @test('Can turn off production listener 1', 'whoami::v2020_12_25')
    @test(
        'Can turn off production listener 2',
        'list-organizations::v2020_12_25'
    )
    protected static async canTurnOffProductionListener(fqen: EventName) {
        this.dropInFakeSocket()
        this.fqen = fqen

        await this.connect()

        let shouldBeHit = false
        let shouldNotBeHit = false

        const cb = () => {
            shouldNotBeHit = true
            return this.emptyResponse
        }

        await this.on(cb)
        await this.on(() => {
            shouldBeHit = true
            return this.emptyResponse
        })

        await this.off(cb)
        await this.emit()

        assert.isTrue(shouldBeHit, 'Listener was not hit and should have been')
        assert.isFalse(
            shouldNotBeHit,
            'Listener was hit and should not have been'
        )
    }

    @test()
    protected static async callingOffWithoutListenerRemovesAll() {
        this.dropInFakeSocket()
        await this.connect()
        let hitCount = 0

        await this.on(() => {
            hitCount++
            return this.emptyResponse
        })

        await this.on(() => {
            hitCount++
            return this.emptyResponse
        })

        await this.emit()

        assert.isEqual(hitCount, 2)
        hitCount = 0

        await this.off()

        await this.on(() => {
            hitCount++
            return this.emptyResponse
        })

        await this.emit()
        assert.isEqual(hitCount, 1)
    }

    private static async off(cb?: () => any) {
        await this.client.off(this.fqen, cb)
    }

    private static async on(cb: () => any) {
        await this.client.on(this.fqen, cb)
    }

    private static async emit() {
        await this.client.emit(this.fqen)
    }

    private static async connect() {
        this.client = await this.connectToApi()
        this.client.setShouldAutoRegisterListeners(false)
    }

    private static dropInFakeSocket() {
        MercurySocketIoClient.io = () => new FakeSocket() as any
    }
}

class FakeSocket extends EventEmitter {
    public constructor() {
        super()
        setTimeout(() => super.emit('connect'), 5)
    }

    public emit(...args: any) {
        const cb = args.pop()
        //@ts-ignore
        const results = super.emit(...args)
        cb({ responses: [] })

        return results
    }
}
