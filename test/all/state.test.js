import * as assert from 'assert/strict'

import { State, stateUpdatedEvent } from '../../all/state.js'

export default class {
	state = new State()
	stateInitiallyEmpty() {
		assert.deepEqual(this.state.current, {})
	}
	stateUpdated() {
		let updateEmitted = false
		this.state.on(stateUpdatedEvent, delta => {
			assert.deepEqual(delta, { key: 'value' })
			updateEmitted = true
		})
		this.state.update({ key: 'value' })
		assert.deepEqual(this.state.current, { key: 'value' })
		assert.equal(updateEmitted, true)
	}
	stateUpdateShouldOverwrite() {
		this.state.update({ key: 'value 1' })
		this.state.update({ key: 'value 2' })
		assert.deepEqual(this.state.current, { key: 'value 2' })
	}
}
