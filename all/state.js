import { EventEmitter } from 'events'

export const stateUpdatedEvent = 'stateUpdated'

export class State extends EventEmitter {
	#state = {}

	get current() {
		return this.#state
	}

	update(delta) {
		this.#state = { ...this.#state, ...delta }
		this.emit(stateUpdatedEvent, delta)
	}
}

export const state = new State()
