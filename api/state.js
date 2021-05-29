import { EventEmitter } from 'events'

export const state = new class extends EventEmitter {
	#state = {}
	reset() {
		this.#state = {}
	}
	get current() {
		return this.#state
	}
	update(delta) {
		this.#state = { ...this.#state, ...delta }
		this.emit('update', delta)
	}
}
