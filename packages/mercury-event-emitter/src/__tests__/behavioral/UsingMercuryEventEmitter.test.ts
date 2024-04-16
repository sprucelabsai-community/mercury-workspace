import {
    EventNames,
    MercuryEventEmitter,
    EventContract,
} from '@sprucelabs/mercury-types'
import { eventAssertUtil } from '@sprucelabs/spruce-event-utils'
import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import { errorAssert } from '@sprucelabs/test-utils'
import AbstractEventEmitter from '../../AbstractEventEmitter'
import SpruceError from '../../errors/SpruceError'
import { TestContract, testContract } from './testContract'

class EventEmitter<
    Contract extends EventContract,
> extends AbstractEventEmitter<Contract> {
    public listenCount(eventName: EventNames<Contract>) {
        return (this.listenersByEvent[eventName] || []).length
    }
}

export default class MercuryEventEmitterTest extends AbstractSpruceTest {
    private static emitter: MercuryEventEmitter<TestContract>

    // only use test emitter when accessing methods to make private state public
    private static testEmitter: EventEmitter<TestContract>

    protected static async beforeEach() {
        await super.beforeEach()
        this.testEmitter = new EventEmitter(testContract)
        this.emitter = this.testEmitter as MercuryEventEmitter<TestContract>
    }

    @test()
    protected static canCreateEmitter() {
        const emitter = MercuryEventEmitterTest.emitter
        assert.isTruthy(emitter)
    }

    @test()
    protected static tracksListeners() {
        void this.emitter.on('eventOne', () => {})
    }

    @test()
    protected static listenCountStartsAtZero() {
        assert.isEqual(this.testEmitter.listenCount('eventOne'), 0)
    }

    @test()
    protected static listenCountIncrements() {
        assert.isEqual(this.testEmitter.listenCount('eventOne'), 0)
        void this.emitter.on('eventOne', () => {})
        assert.isEqual(this.testEmitter.listenCount('eventOne'), 1)
    }

    @test()
    protected static async oneListenerCanBeCleared() {
        void this.emitter.on('eventOne', () => {})
        const numForgotten = await this.emitter.off('eventOne')
        assert.isEqual(numForgotten, 1)
        assert.isEqual(this.testEmitter.listenCount('eventOne'), 0)
    }

    @test()
    protected static async twoListenersCanBeCleared() {
        void this.emitter.on('eventOne', () => {})
        void this.emitter.on('eventOne', () => {})

        const numForgotten = await this.emitter.off('eventOne')

        assert.isEqual(numForgotten, 2)
        assert.isEqual(this.testEmitter.listenCount('eventOne'), 0)
    }

    @test()
    protected static async specificListenerCanBeCleared() {
        let cb1Count = 0
        let cb2Count = 0

        const cb = () => {
            cb1Count++
        }

        void this.emitter.on('eventTwo', cb)
        void this.emitter.on('eventOne', cb)
        void this.emitter.on('eventOne', () => {
            cb2Count++
        })
        void this.emitter.on('eventTwo', cb)

        let numForgotten = await this.emitter.off('eventOne', cb)

        assert.isEqual(numForgotten, 1)
        assert.isEqual(this.testEmitter.listenCount('eventOne'), 1)

        await this.emitter.emit('eventOne')
        assert.isEqual(cb1Count, 0)

        await this.emitter.emit('eventTwo')
        assert.isEqual(cb2Count, 1)

        numForgotten = await this.emitter.off('eventOne', () => {})
        assert.isEqual(numForgotten, 0)

        numForgotten = await this.emitter.off('eventTwo', cb)
        assert.isEqual(numForgotten, 2)
    }

    @test()
    protected static clearingListenersHonorsEventName() {
        void this.emitter.on('eventOne', () => {})
        void this.emitter.on('eventTwo', () => {})

        void this.emitter.off('eventOne')

        assert.isEqual(this.testEmitter.listenCount('eventOne'), 0)
        assert.isEqual(this.testEmitter.listenCount('eventTwo'), 1)
    }

    @test()
    protected static async emittingTriggersCallback() {
        let fired = false

        void this.emitter.on('eventOne', () => {
            fired = true
        })

        await this.emitter.emit('eventOne')

        assert.isTrue(fired)
    }

    @test()
    protected static async emitPassesThroughEmitPayload() {
        let payload: any | undefined

        void this.emitter.on('eventWithEmitPayload', (p) => {
            payload = p
        })

        await this.emitter.emit('eventWithEmitPayload', {
            optionalTextField: 'hello world',
        })

        assert.isEqualDeep(payload, { optionalTextField: 'hello world' })
    }

    @test()
    protected static async oneListenerCanRespondWithPayload() {
        void this.emitter.on('eventWithResponsePayload', () => {
            return {
                requiredTextField: 'foo bar',
            }
        })

        const responses = await this.emitter.emit('eventWithResponsePayload')

        assert.isEqualDeep(responses, {
            totalContracts: 1,
            totalResponses: 1,
            totalErrors: 0,
            responses: [
                {
                    payload: {
                        requiredTextField: 'foo bar',
                    },
                },
            ],
        })
    }

    @test()
    protected static async multipleListenersCanRespondWithPayloads() {
        void this.emitter.on('eventWithResponsePayload', () => ({
            requiredTextField: 'foo bar',
        }))

        void this.emitter.on('eventWithResponsePayload', () => ({
            requiredTextField: 'hello world',
        }))

        const responses = await this.emitter.emit('eventWithResponsePayload')

        assert.isEqualDeep(responses, {
            totalContracts: 2,
            totalResponses: 2,
            totalErrors: 0,
            responses: [
                {
                    payload: {
                        requiredTextField: 'foo bar',
                    },
                },
                {
                    payload: {
                        requiredTextField: 'hello world',
                    },
                },
            ],
        })
    }

    @test()
    protected static async emitCanListenToEachListener() {
        void this.emitter.on('eventWithResponsePayload', () => ({
            requiredTextField: 'foo bar',
        }))

        void this.emitter.on('eventWithResponsePayload', () => ({
            requiredTextField: 'hello world',
        }))

        let count = 0
        const payloads: any[] = []

        await this.emitter.emit('eventWithResponsePayload', (payload) => {
            count++
            payloads.push(payload)
        })

        assert.isEqual(count, 2)
        assert.isEqualDeep(payloads, [
            {
                payload: {
                    requiredTextField: 'foo bar',
                },
            },
            {
                payload: {
                    requiredTextField: 'hello world',
                },
            },
        ])
    }

    @test()
    protected static async emitAndRespondCanEachHandlePayloads() {
        void this.emitter.on('eventWithEmitAndResponsePayload', () => ({
            requiredTextField: 'foo bar',
        }))

        void this.emitter.on('eventWithEmitAndResponsePayload', () => ({
            requiredTextField: 'hello world',
        }))

        let count = 0
        const listenerResponses: any[] = []

        const results = await this.emitter.emit(
            'eventWithEmitAndResponsePayload',
            { requiredTextField: 'great' },
            (response) => {
                count++
                listenerResponses.push(response)
            }
        )

        assert.isEqual(count, 2)
        assert.isEqualDeep(listenerResponses, [
            {
                payload: {
                    requiredTextField: 'foo bar',
                },
            },
            {
                payload: {
                    requiredTextField: 'hello world',
                },
            },
        ])

        assert.isEqualDeep(results, {
            totalContracts: 2,
            totalResponses: 2,
            totalErrors: 0,
            responses: [
                {
                    payload: {
                        requiredTextField: 'foo bar',
                    },
                },
                {
                    payload: {
                        requiredTextField: 'hello world',
                    },
                },
            ],
        })
    }

    @test()
    protected static async respondsToEachCallbackWithoutPayload() {
        void this.emitter.on('eventWithResponsePayload', () => ({
            requiredTextField: 'foo bar',
        }))

        void this.emitter.on('eventWithResponsePayload', () => ({
            requiredTextField: 'hello world',
        }))

        void this.emitter.on('eventWithResponsePayload', () => ({
            requiredTextField: 'hello world',
        }))

        let hitCount = 0
        await this.emitter.emit('eventWithResponsePayload', () => {
            hitCount++
        })
        assert.isEqual(hitCount, 3)
    }

    @test()
    protected static async emittingBadEventThrows() {
        const error = (await assert.doesThrowAsync(() =>
            //@ts-ignore
            this.emitter.emit('does-not-exist')
        )) as SpruceError

        this.assertError(error, 'INVALID_EVENT_NAME', {
            validNames: [
                'eventOne',
                'eventTwo',
                'eventWithEmitPayload',
                'eventWithResponsePayload',
                'eventWithEmitAndResponsePayload',
            ],
        })
    }

    @test()
    protected static async canValidateEmitPayload() {
        const error = (await assert.doesThrowAsync(() =>
            //@ts-ignore
            this.emitter.emit('eventWithEmitPayload', { bad: true })
        )) as SpruceError

        this.assertError(error, 'INVALID_PAYLOAD', {
            eventName: 'eventWithEmitPayload',
        })
    }

    @test()
    protected static async reportsBackSingleErrorFromListeners() {
        void this.emitter.on('eventOne', () => {
            throw new Error('oh no!')
        })

        const totalListeners = 1
        const expectedErrors = ['oh no!']

        await this.emitAndAssertExpectedErrors(totalListeners, expectedErrors)
    }

    @test()
    protected static async reportsBackOneErrorOneSuccessFromListeners() {
        void this.emitter.on('eventOne', () => {
            throw new Error('oh no!')
        })

        void this.emitter.on('eventOne', () => {})

        const totalListeners = 2
        const expectedErrors = ['oh no!', undefined]

        await this.emitAndAssertExpectedErrors(totalListeners, expectedErrors)
    }

    @test()
    protected static async reportsBackMultipleErrorsFromListeners() {
        void this.emitter.on('eventOne', () => {
            throw new Error('oh no!')
        })

        void this.emitter.on('eventOne', () => {
            throw new Error('oh yes!')
        })

        void this.emitter.on('eventOne', () => {})

        const totalListeners = 3
        const expectedErrors = ['oh no!', 'oh yes!', undefined]

        await this.emitAndAssertExpectedErrors(totalListeners, expectedErrors)
    }

    @test()
    protected static async spruceErrorsInListenersAreRetained() {
        void this.emitter.on('eventOne', () => {
            throw new SpruceError({
                code: 'MISSING_PARAMETERS',
                parameters: [],
            })
        })

        const results = await this.emitter.emit('eventOne')

        eventAssertUtil.assertErrorFromResponse(results, 'MISSING_PARAMETERS')
    }

    @test()
    protected static async throwsWhenAddingListenerNotOnContract() {
        const err = await assert.doesThrowAsync(() =>
            //@ts-ignore
            this.emitter.on('taco', () => {})
        )

        errorAssert.assertError(err, 'INVALID_EVENT_NAME')
    }

    @test()
    protected static async rendersTextErrorsInListeners() {
        void this.emitter.on('eventOne', () => {
            throw 'uh ooooh!'
        })

        const results = await this.emitter.emit('eventOne')

        assert.doesInclude(
            results.responses[0]?.errors?.[0].message,
            'uh ooooh!'
        )
    }

    private static async emitAndAssertExpectedErrors(
        totalListeners: number,
        expectedErrors: (string | undefined)[]
    ) {
        let listenerResponses: Record<string, any>[] = []

        const results = await this.emitter.emit('eventOne', (response) => {
            listenerResponses.push(response)
        })

        this.assertExpectedErrors(
            listenerResponses,
            totalListeners,
            expectedErrors,
            results
        )
    }

    private static assertExpectedErrors(
        listenerResponses: Record<string, any>[],
        totalListeners: number,
        expectedErrors: (string | undefined)[],
        results: any
    ) {
        assert.isLength(listenerResponses, totalListeners)

        assert.doesInclude(results, {
            totalContracts: totalListeners,
            totalResponses: totalListeners,
            totalErrors: expectedErrors.filter((err) => !!err).length,
        })

        let idx = 0
        for (const err of expectedErrors) {
            if (!err) {
                assert.isFalsy(listenerResponses[idx].errors)
                assert.isFalsy(results.responses[idx].errors)
            } else {
                assert.doesInclude(listenerResponses[idx], {
                    'errors[].message': err,
                })
                assert.doesInclude(results.responses[idx], {
                    'errors[].message': err,
                })
            }
            idx++
        }
    }

    private static assertError(
        error: SpruceError,
        expectedCode: string,
        expectedPartialOptions?: Record<string, any>
    ) {
        if (error.options.code === expectedCode) {
            if (expectedPartialOptions) {
                assert.doesInclude(error.options, expectedPartialOptions)
            }
        } else {
            assert.fail(
                `Invalid error code. Expected ${expectedCode} but got ${error.options.code}`
            )
        }
    }
}
