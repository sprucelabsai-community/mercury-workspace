import { buildSchema } from '@sprucelabs/schema'
import { assert, test } from '@sprucelabs/test-utils'
import MercuryClientFactory from '../../clients/MercuryClientFactory'
import MercuryTestClient from '../../clients/MercuryTestClient'
import AbstractClientTest from '../../tests/AbstractClientTest'

export default class EmittingConnectionChangeInTestsTest extends AbstractClientTest {
    protected static async beforeEach() {
        await super.beforeEach()
        MercuryClientFactory.setIsTestMode(true)
    }

    @test()
    protected static async canEmitWithoutCrashing() {
        const emitter = MercuryTestClient.getInternalEmitter()
        await emitter.emitAndFlattenResponses('connection-status-change', {
            payload: {
                status: 'disconnected',
            },
        })

        const client = await this.connectToApi()

        await client.emitAndFlattenResponses('connection-status-change', {
            payload: {
                status: 'disconnected',
            },
        })
    }

    @test()
    protected static async doesntCrashTryingToMixinTwice() {
        //@ts-ignore
        delete MercuryTestClient.emitter
        await this.connectToApi()
    }

    @test()
    protected static async settingEventContractOnTestClientOverridesWhateverIsInTheInternalEmitter() {
        const emitter = MercuryTestClient.getInternalEmitter({
            eventSignatures: {
                'request-pin::v2020_12_25': {
                    emitPayloadSchema: buildSchema({
                        id: 'requestPinEmitPayload',
                        fields: {
                            firstName: {
                                type: 'text',
                                isRequired: true,
                            },
                        },
                    }),
                },
            },
        })

        const client = await this.connectToApi()

        await client.on('request-pin::v2020_12_25', () => {
            return {
                challenge: 'aoeu',
            }
        })

        await emitter.emitAndFlattenResponses('request-pin::v2020_12_25', {
            payload: {
                phone: '5555555555',
            },
        })
    }

    @test()
    protected static async turningOffConnectionStatusChangeListenerDoesnNotThrow() {
        MercuryClientFactory.setIsTestMode(false)
        const client = await this.connectToApi()
        //@ts-ignore
        client.socket.emit = async () =>
            assert.fail('Should not have been called')

        await client.off('connection-status-change')
    }

    @test()
    protected static async shouldNotAttemptToConnectWhenEmittingStatusChange() {
        MercuryClientFactory.setIsTestMode(true)
        const client = await this.connectToApi()

        //@ts-ignore
        client.connectIfNotConnected = async () =>
            assert.fail('Should not have been called')

        await client.emitAndFlattenResponses('connection-status-change', {
            payload: {
                status: 'connecting',
            },
        })
    }
}
