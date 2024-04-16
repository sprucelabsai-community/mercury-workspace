import { test, assert } from '@sprucelabs/test-utils'
import { generateId } from '@sprucelabs/test-utils'
import MercuryClientFactory from '../../clients/MercuryClientFactory'
import MercuryTestClient from '../../clients/MercuryTestClient'
import AbstractClientTest from '../../tests/AbstractClientTest'

export default class TestingWithDefaultContractsTest extends AbstractClientTest {
    @test()
    protected static noDefaultContractToStart() {
        assert.isFalse(MercuryClientFactory.hasDefaultContract())
    }

    @test()
    protected static canSetAndGet() {
        MercuryClientFactory.setDefaultContract({
            eventSignatures: { myEvent: {} },
        })

        assert.isTrue(MercuryClientFactory.hasDefaultContract())
    }

    @test()
    protected static canClearDefaultContract() {
        MercuryClientFactory.setDefaultContract({
            eventSignatures: { myEvent: {} },
        })

        MercuryClientFactory.clearDefaultContract()

        assert.isFalse(MercuryClientFactory.hasDefaultContract())
    }

    @test()
    protected static canMixinTestContract() {
        const id = generateId()
        const expected = {}

        MercuryTestClient.mixinContract({
            eventSignatures: { [id]: expected },
        })

        const emitter = MercuryTestClient.getInternalEmitter()
        assert.isEqualDeep(emitter.getContract().eventSignatures[id], expected)
    }
}
