import {
	EventNames,
	MercuryClient,
	MercuryContract,
	buildMercuryContract,
} from '@sprucelabs/mercury-types'
import { buildSchema } from '@sprucelabs/schema'
import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import AbstractEventEmitter from '../../AbstractEventEmitter'

class EventEmitter<
	Contract extends MercuryContract
> extends AbstractEventEmitter<Contract> {
	public listenCount(eventName: EventNames<Contract>) {
		return (this.listenersByEvent[eventName] || []).length
	}
}

type Contract = {
	eventSignatures: [
		{
			eventNameWithOptionalNamespace: 'eventOne'
		},
		{
			eventNameWithOptionalNamespace: 'eventTwo'
		},
		{
			eventNameWithOptionalNamespace: 'eventWithPayload'
			emitPayload: {
				id: 'firstPayload'
				name: 'First payload'
				fields: {
					optionalTextField: {
						type: FieldType.Text
					}
				}
			}
		}
	]
}
const contract = buildMercuryContract<Contract>({
	eventSignatures: [
		{
			eventNameWithOptionalNamespace: 'eventOne',
		},
		{
			eventNameWithOptionalNamespace: 'eventTwo',
		},
		{
			eventNameWithOptionalNamespace: 'eventWithPayload',
			emitPayload: buildSchema({
				id: 'firstPayload',
				name: 'First payload',
				fields: {
					optionalTextField: {
						type: FieldType.Text,
					},
				},
			}),
		},
	],
})

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
}
