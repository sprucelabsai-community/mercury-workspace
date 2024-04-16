import { SkillEventContract } from '@sprucelabs/mercury-types'
import AbstractSpruceTest from '@sprucelabs/test'
import { assert, test } from '@sprucelabs/test-utils'
import { MercuryClientFactory } from '../..'
import MutableContractClient from '../../clients/MutableContractClient'
import { DEFAULT_HOST } from '../../constants'
import { TEST_HOST } from '../../tests/constants'

export default class MercuryClientFactoryTest extends AbstractSpruceTest {
    @test()
    protected static async clientMixinContract() {
        const client = await MercuryClientFactory.Client({
            host: TEST_HOST,
            allowSelfSignedCrt: true,
            contracts: [
                {
                    eventSignatures: {},
                },
            ],
        })

        assert.isFalse(client.doesHandleEvent('my-cool-event'))

        client.mixinContract({
            eventSignatures: {
                'my-cool-event': {},
            },
        })

        assert.isTrue(client.doesHandleEvent('my-cool-event'))

        await client.disconnect()
    }

    @test()
    protected static async fallsBackToDefaultWhenHostIsUndefined() {
        const client = await MercuryClientFactory.Client({
            host: undefined,
            allowSelfSignedCrt: true,
            contracts: [
                {
                    eventSignatures: {},
                },
            ],
        })

        //@ts-ignore
        assert.isEqual(client.host, DEFAULT_HOST)
    }

    @test()
    protected static async fallsBackToDefaultWhenHostIsNull() {
        const client = await MercuryClientFactory.Client({
            //@ts-ignore
            host: null,
            allowSelfSignedCrt: true,
            contracts: [
                {
                    eventSignatures: {},
                },
            ],
        })

        //@ts-ignore
        assert.isEqual(client.host, DEFAULT_HOST)
    }

    @test()
    protected static async canSetClassToCreate() {
        MercuryClientFactory.ClientClass = SpyClient as any
        const client = await MercuryClientFactory.Client({})
        assert.isInstanceOf(client, SpyClient as any)
    }
}

class SpyClient extends MutableContractClient<SkillEventContract> {}
