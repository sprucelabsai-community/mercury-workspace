import { EventContract } from '@sprucelabs/mercury-types'
import { SchemaError } from '@sprucelabs/schema'
import AbstractSpruceTest, { assert, test } from '@sprucelabs/test'
import AbstractEventEmitter from '../../AbstractEventEmitter'
import { TestContract, testContract } from './testContract'

class EventEmitter<
    Contract extends EventContract,
> extends AbstractEventEmitter<Contract> {}

export default class EmittingAndFlatteningResponsesTest extends AbstractSpruceTest {
    private static emitter: EventEmitter<TestContract>
    protected static async beforeEach() {
        await super.beforeEach()
        this.emitter = new EventEmitter(testContract)
    }

    @test()
    protected static async emitsAndGetsNothing() {
        const results = await this.emitter.emitAndFlattenResponses(
            'eventWithResponsePayload'
        )

        assert.isLength(results, 0)
    }

    @test()
    protected static async throwsOnErrorInFirstResponse() {
        await this.makeEventThrow()

        await assert.doesThrowAsync(() =>
            this.emitter.emitAndFlattenResponses('eventWithResponsePayload')
        )
    }

    @test()
    protected static async getsBackExpectedResponses() {
        await this.addListener('test')

        const results = await this.emit()

        assert.isLength(results, 1)
        assert.isEqualDeep(results, [{ requiredTextField: 'test' }])
    }

    @test()
    protected static async getsBackAllResponses() {
        await this.addListener('test')
        await this.addListener('test1')
        await this.addListener('test2')

        const results = await this.emit()
        assert.isLength(results, 3)
    }

    @test()
    protected static async throwsErrorIf3rdResponseIsError() {
        await this.addListener('aoeu')
        await this.addListener('aoeuy5')
        await this.makeEventThrow('eventWithEmitAndResponsePayload')

        await assert.doesThrowAsync(() =>
            this.emitter.emitAndFlattenResponses(
                'eventWithEmitAndResponsePayload'
            )
        )
    }

    @test()
    protected static async callsCallbackForFirst() {
        await this.addListener('aoeuaoeu')
        let hitCount = 0
        await this.emit(() => {
            hitCount++
        })

        assert.isEqual(hitCount, 1)
    }

    @test()
    protected static async callsCallbackForEachListener() {
        await this.addListener('aoeuaoeu')
        await this.addListener('aoeuaoeu')
        await this.addListener('aoeuaoeu')
        await this.addListener('aoeuaoeu')

        let hitCount = 0
        await this.emit(() => {
            hitCount++
        })

        assert.isEqual(hitCount, 4)
    }

    private static async makeEventThrow(
        eventName = 'eventWithResponsePayload'
    ) {
        await this.emitter.on(eventName as any, () => {
            throw new SchemaError({
                code: 'INVALID_PARAMETERS',
                parameters: ['test'],
            })
        })
    }

    private static async emit(cb?: any) {
        return await this.emitter.emitAndFlattenResponses(
            'eventWithEmitAndResponsePayload',
            {
                requiredTextField: 'testing',
            },
            cb
        )
    }

    private static async addListener(responseValue: string) {
        await this.emitter.on('eventWithEmitAndResponsePayload', () => {
            return {
                requiredTextField: responseValue,
            }
        })
    }
}
