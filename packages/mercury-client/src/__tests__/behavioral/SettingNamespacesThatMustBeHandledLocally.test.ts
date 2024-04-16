import { test, assert } from '@sprucelabs/test-utils'
import { errorAssert } from '@sprucelabs/test-utils'
import { MercuryClientFactory, MercuryTestClient } from '../..'
import AbstractClientTest from '../../tests/AbstractClientTest'

export default class SettingNamespacesThatMustBeHandledLocallyTest extends AbstractClientTest {
    protected static async beforeEach() {
        await super.beforeEach()
        MercuryClientFactory.setIsTestMode(true)
    }

    @test('handled local with [test]', ['test'], 'test.should-have-listener')
    @test(
        'handled local with [heartwood]',
        ['test', 'heartwood'],
        'heartwood.should-have-listener'
    )
    protected static async canSetNamespaceThatMustBeHandledLocally(
        namespaces: string[],
        fqen: string
    ) {
        const client = await this.setNamespacesAndConnect(namespaces, fqen)

        const err = await assert.doesThrowAsync(() => client.emit(fqen))

        errorAssert.assertError(err, 'MUST_HANDLE_LOCALLY')

        const actual = MercuryTestClient.getNamespacesThatMustBeHandledLocally()

        assert.isEqualDeep(actual, namespaces)
    }

    @test()
    protected static async niceErrorForUnhandledEvent() {
        const client = await this.setNamespacesAndConnect(['profile'], '')
        const err = await assert.doesThrowAsync(() =>
            client.emit('profile.get-down!')
        )

        errorAssert.assertError(err, 'MUST_CREATE_EVENT')
    }

    @test()
    protected static async settingALocalListenerDoesntThrow() {
        const client = await this.setNamespacesAndConnect(
            ['test'],
            'test.should-work'
        )
        const client1 = await this.connectToApi()

        //@ts-ignore
        await client1.on('test.should-work', () => {})

        await client.emit('test.should-work')
    }

    private static async setNamespacesAndConnect(
        namespaces: string[],
        fqen: string
    ) {
        const client = await this.TestClient()

        MercuryTestClient.setNamespacesThatMustBeHandledLocally(namespaces)

        client.mixinContract({
            eventSignatures: {
                [fqen]: {
                    isGlobal: true,
                },
            },
        })
        return client
    }

    private static async TestClient() {
        return (await this.connectToApi({})) as MercuryTestClient
    }
}
