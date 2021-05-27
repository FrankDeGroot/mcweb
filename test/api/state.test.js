import { strict as assert } from 'assert'

import { state } from '../../api/state.js'

const { log } = console

export class B {
	static before() {
		log('default before all')
	}
	before() {
		log('default before each')
	}
	test1() {
		log('default test 1')
	}
	test2() {
		log('default test 2')
		assert.equal('a', 'b')
	}
	after() {
		log('default after each')
	}
	static after() {
		log('default after all')
	}
}

export class A {
	static before() {
		log('A before all')
	}
	before() {
		log('A before each')
	}
	test1() {
		log('A test 1')
	}
	test2() {
		log('A test 2')
		assert.equal('a', 'b')
	}
	after() {
		log('A after each')
	}
	static after() {
		log('A after all')
	}
}

export default class {
	beforeEach() {
		state.reset()
	}
	stateInitiallyEmpty() {
		assert.deepEqual(state.current, {})
	}
	stateUpdated() {
		let updateEmitted = false
		state.on('update', () => {
			updateEmitted = true
		})
		state.update({ key: 'value' })
		assert.deepEqual(state.current, { key: 'value' })
		assert.deepEqual(updateEmitted, true)
	}
	stateUpdateShouldOverwrite() {
		state.update({ key: 'value 1' })
		state.update({ key: 'value 2' })
		assert.deepEqual(state.current, { key: 'value 2' })
	}
}
