import {
	EventNames,
	MercuryClient,
	EventContract,
} from '@sprucelabs/mercury-types'
import { buildSchema } from '@sprucelabs/schema'
import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import AbstractEventEmitter from '../../AbstractEventEmitter'
import SpruceError from '../../errors/SpruceError'

class EventEmitter<Contract extends EventContract> extends AbstractEventEmitter<
	Contract
> {
	public listenCount(eventName: EventNames<Contract>) {
		return (this.listenersByEvent[eventName] || []).length
	}
}

const contract = {
	eventSignatures: [
		{
			eventNameWithOptionalNamespace: 'eventOne',
		},
		{
			eventNameWithOptionalNamespace: 'eventTwo',
		},
		{
			eventNameWithOptionalNamespace: 'eventWithEmitPayload',
			emitPayload: buildSchema({
				id: 'emitPayloadWithOptionalTextField',
				name: 'Emit payload with optional text field',
				fields: {
					optionalTextField: {
						type: 'text',
					},
				},
			}),
		},
		{
			eventNameWithOptionalNamespace: 'eventWithResponsePayload',
			responsePayload: buildSchema({
				id: 'responsePayloadWithRequiredTextField',
				name: 'responsePayloadWithRequiredTextField',
				fields: {
					requiredTextField: {
						type: 'text',
						isRequired: true,
					},
				},
			}),
		},
		{
			eventNameWithOptionalNamespace: 'eventWithEmitAndResponsePayload',
			emitPayload: buildSchema({
				id: 'emitPayloadWithRequiredTextField',
				name: 'emitPayloadWithRequiredTextField',
				fields: {
					requiredTextField: {
						type: 'text',
						isRequired: true,
					},
				},
			}),
			responsePayload: buildSchema({
				id: 'secondPayloadWithRequiredTextField',
				name: 'secondPayloadWithRequiredTextField',
				fields: {
					requiredTextField: {
						type: 'text',
						isRequired: true,
					},
				},
			}),
		},
	],
} as const

type Contract = typeof contract

export default class MercuryEventEmitterTest extends AbstractSpruceTest {
	private static emitter: MercuryClient<Contract>

	// only use test emitter when accessing methods to make private state public
	private static testEmitter: EventEmitter<Contract>

	protected static async beforeEach() {
		await super.beforeEach()
		this.testEmitter = new EventEmitter(contract)
		this.emitter = this.testEmitter as MercuryClient<Contract>
	}

	@test()
	protected static canCreateEmitter() {
		const emitter = MercuryEventEmitterTest.emitter
		assert.isTruthy(emitter)
	}

	@test()
	protected static tracksListeners() {
		this.emitter.on('eventOne', () => {})
	}

	@test()
	protected static listenCountStartsAtZero() {
		assert.isEqual(this.testEmitter.listenCount('eventOne'), 0)
	}

	@test()
	protected static listenCountIncrements() {
		assert.isEqual(this.testEmitter.listenCount('eventOne'), 0)
		this.emitter.on('eventOne', () => {})
		assert.isEqual(this.testEmitter.listenCount('eventOne'), 1)
	}

	@test()
	protected static oneListenerCanBeCleared() {
		this.emitter.on('eventOne', () => {})
		const numForgotten = this.emitter.off('eventOne')
		assert.isEqual(numForgotten, 1)
		assert.isEqual(this.testEmitter.listenCount('eventOne'), 0)
	}

	@test()
	protected static twoListenersCanBeCleared() {
		this.emitter.on('eventOne', () => {})
		this.emitter.on('eventOne', () => {})

		const numForgotten = this.emitter.off('eventOne')

		assert.isEqual(numForgotten, 2)
		assert.isEqual(this.testEmitter.listenCount('eventOne'), 0)
	}

	@test()
	protected static specificListenerCanBeCleared() {
		const cb = () => {}

		this.emitter.on('eventOne', cb)
		this.emitter.on('eventOne', () => {})

		let numForgotten = this.emitter.off('eventOne', cb)

		assert.isEqual(numForgotten, 1)
		assert.isEqual(this.testEmitter.listenCount('eventOne'), 1)

		numForgotten = this.emitter.off('eventOne', () => {})
		assert.isEqual(numForgotten, 0)
	}

	@test()
	protected static clearingListenersHonorsEventName() {
		this.emitter.on('eventOne', () => {})
		this.emitter.on('eventTwo', () => {})

		this.emitter.off('eventOne')

		assert.isEqual(this.testEmitter.listenCount('eventOne'), 0)
		assert.isEqual(this.testEmitter.listenCount('eventTwo'), 1)
	}

	@test()
	protected static async emittingTriggersCallback() {
		let fired = false

		this.emitter.on('eventOne', () => {
			fired = true
		})

		await this.emitter.emit('eventOne')

		assert.isTrue(fired)
	}

	@test()
	protected static async emitPassesThroughEmitPayload() {
		let payload: any | undefined

		this.emitter.on('eventWithEmitPayload', (p) => {
			payload = p
		})

		await this.emitter.emit('eventWithEmitPayload', {
			optionalTextField: 'hello world',
		})

		assert.isEqualDeep(payload, { optionalTextField: 'hello world' })
	}

	@test()
	protected static async oneListenerCanRespondWithPayload() {
		this.emitter.on('eventWithResponsePayload', () => {
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
		this.emitter.on('eventWithResponsePayload', () => ({
			requiredTextField: 'foo bar',
		}))

		this.emitter.on('eventWithResponsePayload', () => ({
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
		this.emitter.on('eventWithResponsePayload', () => ({
			requiredTextField: 'foo bar',
		}))

		this.emitter.on('eventWithResponsePayload', () => ({
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
		this.emitter.on('eventWithEmitAndResponsePayload', () => ({
			requiredTextField: 'foo bar',
		}))

		this.emitter.on('eventWithEmitAndResponsePayload', () => ({
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
			eventNameWithOptionalNamespace: 'eventWithEmitPayload',
		})
	}

	@test()
	protected static async reportsBackSingleErrorFromListeners() {
		this.emitter.on('eventOne', () => {
			throw new Error('oh no!')
		})

		const totalListeners = 1
		const expectedErrors = ['oh no!']

		await this.emitAndAssertExpectedErrors(totalListeners, expectedErrors)
	}

	@test()
	protected static async reportsBackOneErrorOneSuccessFromListeners() {
		this.emitter.on('eventOne', () => {
			throw new Error('oh no!')
		})

		this.emitter.on('eventOne', () => {})

		const totalListeners = 2
		const expectedErrors = ['oh no!', undefined]

		await this.emitAndAssertExpectedErrors(totalListeners, expectedErrors)
	}

	@test()
	protected static async reportsBackMultipleErrorsFromListeners() {
		this.emitter.on('eventOne', () => {
			throw new Error('oh no!')
		})

		this.emitter.on('eventOne', () => {
			throw new Error('oh yes!')
		})

		this.emitter.on('eventOne', () => {})

		const totalListeners = 3
		const expectedErrors = ['oh no!', 'oh yes!', undefined]

		await this.emitAndAssertExpectedErrors(totalListeners, expectedErrors)
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
				assert.doesInclude(listenerResponses[idx], { 'errors[].message': err })
				assert.doesInclude(results.responses[idx], { 'errors[].message': err })
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
