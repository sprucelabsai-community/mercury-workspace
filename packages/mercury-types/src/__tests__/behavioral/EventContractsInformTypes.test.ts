import { buildSchema } from '@sprucelabs/schema'
import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import { EventContract, EventNames } from '../../mercury.types'
import TestClient from '../../TestClient'
import buildEventContract from '../../utilities/buildEventContract'
import validateEventContract from '../../utilities/validateEventContract'

const responsePayload = buildSchema({
	id: 'listenResponse',
	name: 'Test listen response',
	fields: {
		responsePayloadField: {
			type: 'text',
			isRequired: true,
		},
	},
})

const emitPayload = buildSchema({
	id: 'emit',
	name: 'Test emit payload',
	fields: {
		emitPayloadField: {
			type: 'text',
			isRequired: true,
		},
	},
})

interface TestContract extends EventContract {
	eventSignatures: {
		'spruce.testWithPayload': {
			responsePayloadSchema: typeof responsePayload
			emitPayloadSchema: typeof emitPayload
		}
		'spruce.testWithoutPayload': {
			responsePayloadSchema: null
		}
	}
}

const signupContract = buildEventContract({
	eventSignatures: {
		'sign-up': {
			responsePayloadSchema: buildSchema({
				id: 'response',
				fields: {
					id: {
						type: 'text',
						isRequired: true,
					},
				},
			}),
			emitPayloadSchema: buildSchema({
				id: 'targetAndPayload',
				fields: {
					target: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: buildSchema({
								id: 'target',
								fields: {
									organizationId: {
										type: 'text',
									},
									locationId: {
										type: 'text',
									},
									personId: {
										type: 'text',
									},
								},
							}),
						},
					},
					payload: {
						type: 'schema',
						isRequired: true,
						options: {
							schema: buildSchema({
								id: 'payload',
								fields: {
									firstName: {
										type: 'text',
										isRequired: true,
									},
									lastName: {
										type: 'text',
										isRequired: true,
									},
								},
							}),
						},
					},
				},
			}),
		},
		'log-out': {},
	},
})

validateEventContract(signupContract)

type SignupContract = typeof signupContract

export default class TypesWorkTest extends AbstractSpruceTest {
	@test('Can pull event names (always passes, types will fail)')
	protected static async canPullEventNames() {
		type Names = EventNames<SignupContract>
		assert.isExactType<Names, 'sign-up' | 'log-out'>(true)
	}

	@test('Emitting with contract with payload (always passes, types will fail)')
	protected static async emitWithPayload() {
		const client = new TestClient<TestContract>()
		const results = await client.emit(
			'spruce.testWithPayload',
			{ emitPayloadField: '100' },
			(response) => {
				assert.isType<string | undefined>(
					response.payload?.responsePayloadField
				)
			}
		)

		assert.isTruthy(results.responses[0].payload)
		assert.isType<string>(results.responses[0].payload.responsePayloadField)
	}

	@test(
		'Emitting with contract without payload (always passes, types will fail)'
	)
	protected static async emitWithoutPayload() {
		const client = new TestClient<TestContract>()
		const results = await client.emit('spruce.testWithoutPayload', async () => {
			console.log('never called')
		})

		assert.isType<never | undefined>(results.responses[0].payload)
		assert.isEqual(results.responses[0].responderRef, 'test')
	}

	@test('On with contract with payload (always passes, types will fail)')
	protected static async onWithPayload() {
		const client = new TestClient<TestContract>()

		await client.on('spruce.testWithPayload', async (payload) => {
			assert.isExactType<typeof payload, { emitPayloadField: string }>(true)

			return {
				responsePayloadField: 'response!',
			}
		})
	}

	@test('On with contract without payload (always passes, types will fail)')
	protected static async onWithoutPayload() {
		const client = new TestClient<TestContract>()

		await client.on('spruce.testWithoutPayload', () => {})
	}

	@test('Handles target and payload (always passes, types will fail)')
	protected static async handlesTarget() {
		const client = new TestClient<SignupContract>()
		const results = await client.emit('sign-up', {
			target: {
				organizationId: '10',
			},
			payload: {
				firstName: 'test',
				lastName: 'user',
			},
		})

		const id = results.responses[0].payload?.id
		assert.isExactType<string | undefined, typeof id>(true)
	}
}
