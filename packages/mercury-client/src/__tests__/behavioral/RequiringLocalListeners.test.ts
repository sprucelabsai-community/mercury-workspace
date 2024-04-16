import { test, assert } from '@sprucelabs/test-utils'
import { errorAssert } from '@sprucelabs/test-utils'
import MercuryClientFactory from '../../clients/MercuryClientFactory'
import MercuryTestClient from '../../clients/MercuryTestClient'
import AbstractClientTest from '../../tests/AbstractClientTest'

export default class RequiringLocalListenersTest extends AbstractClientTest {
    protected static async beforeEach() {
        await super.beforeEach()
        MercuryClientFactory.setIsTestMode(true)
        MercuryTestClient.setShouldRequireLocalListeners(false)
    }

    @test()
    protected static async canCreateDisablingRemoteCalls() {
        MercuryTestClient.setShouldRequireLocalListeners(true)

        const client = await this.connectToApi()

        const err = await assert.doesThrowAsync(() =>
            client.emit('whoami::v2020_12_25')
        )

        errorAssert.assertError(err, 'MUST_HANDLE_LOCALLY')

        const client2 = await this.connectToApi()

        await client2.on('whoami::v2020_12_25', () => {
            return {
                auth: {},
                type: 'anonymous' as const,
            }
        })

        await client.emit('whoami::v2020_12_25')
    }

    @test()
    protected static async knowsIfLocalListenersRequired() {
        assert.isFalse(MercuryTestClient.getShouldRequireLocalListeners())
        MercuryTestClient.setShouldRequireLocalListeners(true)
        assert.isTrue(MercuryTestClient.getShouldRequireLocalListeners())
    }

    @test()
    protected static async canDisableLocalListenersEvenIfSetToListenerForNamespace() {
        MercuryTestClient.setNamespacesThatMustBeHandledLocally(['lumena'])
        MercuryTestClient.setShouldRequireLocalListeners(false)
        const client = (await this.connectToApi()) as MercuryTestClient
        client.mixinContract({
            eventSignatures: {
                'lumena.test': {
                    isGlobal: true,
                },
            },
        })

        await client.emitAndFlattenResponses('lumena.test' as any)
    }
}
