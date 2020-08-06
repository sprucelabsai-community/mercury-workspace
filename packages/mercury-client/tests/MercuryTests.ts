import { assert } from 'chai'
import { Mercury } from '../src/Mercury'
import Base from './Base'

class MercuryTests extends Base {
	public setup() {
		it('Can create a mercury instance', () => this.createMercury())
	}

	public async createMercury() {
		const mercury = new Mercury()
		assert.isOk(mercury)
	}
}

describe('MercuryTests', function Tests() {
	new MercuryTests()
})
