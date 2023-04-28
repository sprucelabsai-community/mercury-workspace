import { buildEventContract, EventContract } from '@sprucelabs/mercury-types'
import { buildSchema } from '@sprucelabs/schema'
import AbstractSpruceTest from '@sprucelabs/test'
import { assert, test } from '@sprucelabs/test-utils'
import AbstractEventEmitter from '../../AbstractEventEmitter'

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
			return {
				num: 0,
			}
		})

		await emitter.on('event', async () => {
			await new Promise((resolve) => setTimeout(resolve, 100))
			assert.isTrue(wasEvent2Hit !== shouldEmitSequentally)
			return { num: 1 }
		})

		await emitter.on('event', async () => {
			wasEvent2Hit = true
			return { num: 2 }
		})

		const results = await emitter.emit('event')

		assert.isEqualDeep(results.responses, [
			{ payload: { num: 0 } },
			{ payload: { num: 1 } },
			{ payload: { num: 2 } },
		])
	}
}

const contract = buildEventContract({
	eventSignatures: {
		event: {
			responsePayloadSchema: buildSchema({
				id: 'response',
				fields: {
					num: {
						type: 'number',
						isRequired: true,
						options: {},
					},
				},
			}),
		},
	},
})

class EventEmitter<
	Contract extends EventContract
> extends AbstractEventEmitter<Contract> {}

type Contract = typeof contract
