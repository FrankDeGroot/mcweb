import { EventEmitter } from 'events'
import { inherits } from 'util'

const State = function () {
	this.current = {}
	this.update = delta => {
		this.current = { ...this.current, ...delta }
		this.emit('update', delta)
	}
}

inherits(State, EventEmitter)

export let state = new State()
