import { buildSchema } from '@sprucelabs/schema'
import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import TestClient from '../../TestClient'

const responsePayload = buildSchema({
	id: 'listenResponse',
	name: 'Test listen response',
	fields: {
		responsePayloadField: {
			type: FieldType.Text,
			isRequired: true,
		},
	},
})

const emitPayload = buildSchema({
	id: 'emit',
	name: 'Test emit payload',
	fields: {
		emitPayloadField: {
			type: FieldType.Text,
			isRequired: true,
		},
	},
})

interface TestContract {
	['spruce.testWithPayload']: {
		responsePayload: typeof responsePayload
		emitPayload: typeof emitPayload
	}
	['spruce.testWithoutPayload']: {
		responsePayload: undefined
		emitPayload: undefined
	}
}

export default class TypesWorkTest extends AbstractSpruceTest {
	@test('Test contract with payload (always passes, types will fail)')
	protected static async withPayload() {
		const client = new TestClient<TestContract>()
		const results = await client.emit(
			'spruce.testWithPayload',
			{
				emitPayloadField: 'hello-world',
			},
			(response) => {
				assert.isType<string | undefined>(
					response.payload?.responsePayloadField
				)
				assert.isType<number>(response.totalContracts)
			}
		)

		assert.isType<string | undefined>(
			results.responses[0].payload?.responsePayloadField
		)
	}

	@test('Test contract without payload (always passes, types will fail')
	protected static async withoutPayload() {
		const client = new TestClient<TestContract>()
		const results = await client.emit('spruce.testWithoutPayload', () => {
			console.log('never called')
		})

		assert.isType<never | undefined>(results.responses[0]?.payload)
		assert.isEqual(results.responses[0].responderName, 'test')
	}
}
