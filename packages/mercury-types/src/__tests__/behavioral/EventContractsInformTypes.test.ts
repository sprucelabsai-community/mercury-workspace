import { buildSchema } from '@sprucelabs/schema'
import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import { EventContract } from '../../mercury.types'
import TestClient from '../../TestClient'

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
	eventSignatures: [
		{
			eventNameWithOptionalNamespace: 'spruce.testWithPayload'
			responsePayload: typeof responsePayload
			emitPayload: typeof emitPayload
		},
		{
			eventNameWithOptionalNamespace: 'spruce.testWithoutPayload'
		}
	]
}

export default class TypesWorkTest extends AbstractSpruceTest {
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
		'Emitting with contract without payload (always passes, types will fail'
	)
	protected static async emitWithoutPayload() {
		const client = new TestClient<TestContract>()
		const results = await client.emit('spruce.testWithoutPayload', async () => {
			console.log('never called')
		})

		assert.isType<never | undefined>(results.responses[0].payload)
		assert.isEqual(results.responses[0].responderRef, 'test')
	}

	@test('On with contract with payload (always passes, types will fail')
	protected static async onWithPayload() {
		const client = new TestClient<TestContract>()

		client.on('spruce.testWithPayload', async (payload) => {
			assert.isExactType<typeof payload, { emitPayloadField: string }>(true)

			return {
				responsePayloadField: 'response!',
			}
		})
	}

	@test('On with contract without payload (always passes, types will fail')
	protected static async onWithoutPayload() {
		const client = new TestClient<TestContract>()

		client.on('spruce.testWithoutPayload', () => {})
	}
}
