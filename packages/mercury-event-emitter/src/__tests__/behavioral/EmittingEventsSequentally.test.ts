import { buildEventContract, EventContract } from '@sprucelabs/mercury-types'
import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import AbstractEventEmitter from '../../AbstractEventEmitter'

const contract = buildEventContract({
	eventSignatures: {
		event: {
			responsePayloadSchema: {
				id: 'response',
				fields: {
					num: {
						type: 'number',
						options: {
							isRequired: true,
						},
					},
				},
			},
		},
	},
})

class EventEmitter<
	Contract extends EventContract
> extends AbstractEventEmitter<Contract> {}

type Contract = typeof contract

export default class EmittingEventsSequentallyTest extends AbstractSpruceTest {
	
	@test('should fire sequentally', true)
	@test('should fire in parallel', false)
	protected static async eventsShouldWaitForTheEventBeforeWhenEmittingSequentally(
		shouldEmitSequentally: boolean
	) {
		const emitter = new EventEmitter<Contract>(contract, {
			shouldEmitSequentally,
		})

		let wasEvent2Hit = false

		await emitter.on('event', async () => {
			return 0
		})

		await emitter.on('event', async () => {
			await new Promise((resolve) => setTimeout(resolve, 100))
			assert.isTrue(wasEvent2Hit !== shouldEmitSequentally)
			return 1
		})

		await emitter.on('event', async () => {
			wasEvent2Hit = true
			return 2
		})

		const results = await emitter.emit('event')

		assert.isEqualDeep(results.responses, [
			{ payload: 0 },
			{ payload: 1 },
			{ payload: 2 },
		])
	}
}
