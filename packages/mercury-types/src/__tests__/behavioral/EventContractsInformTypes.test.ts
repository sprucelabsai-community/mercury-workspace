import { buildSchema } from '@sprucelabs/schema'
import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import { MercuryContract } from '../../Mercury.types'
import { TestClient } from '../../TestClient'

const listenResponsePayload = buildSchema({
	id: 'listenResponse',
	name: 'Test listen response',
	fields: {
		id: {
			type: FieldType.Text,
		},
	},
})

const emitPayload = buildSchema({
	id: 'emit',
	name: 'Test emit payload',
	fields: {
		id: {
			type: FieldType.Text,
		},
	},
})

interface TestContract extends MercuryContract {
	spruce: {
		testWithPayload: {
			listenResponsePayload: typeof listenResponsePayload
			emitPayload: typeof emitPayload
		}
		testWithoutPayload: {
			listenResponsePayload: undefined
			emitPayload: undefined
		}
	}
}

export default class TypesWorkTest extends AbstractSpruceTest {
	@test()
	protected static async canCreateClientWithBasicContract() {
		const client = new TestClient<TestContract>()

		client.emit('spruce', 'testWithPayload')
	}

	@test()
	protected static async typesWork() {
		assert.isTrue(false)
	}
}
