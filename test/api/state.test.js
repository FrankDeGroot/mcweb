import { strict as assert } from 'assert'

import { state } from '../../api/state.js'

export default class {
	before() {
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
