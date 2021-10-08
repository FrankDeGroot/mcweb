import * as events from '../events.js'

export class UpdateViewModel {
	#state = {
		busy: false
	}
	#socket
	#changeScheduler
	constructor(socket, changeScheduler) {
		this.#socket = socket
		this.#changeScheduler = changeScheduler
	}
	get updateReleaseButtonDisabled() {
		return this.#state.busy
	}
	get updateSnapshotButtonDisabled() {
		return this.#state.busy
	}
	get startMinecraftButtonDisabled() {
		return this.#state.server !== 'stopped'
	}
	get stopMinecraftButtonDisabled() {
		return this.#state.server !== 'started'
	}
	get sendMinecraftButtonDisabled() {
		return this.#state.server !== 'started'
	}
	#canUpdateVersion(version) {
		return ['release', 'snapshot'].indexOf(version) !== -1
	}
	updateVersion(version) {
		if (this.#canUpdateVersion(version)) this.#socket.emit('update', { version })
	}
	startMinecraft() {
		this.#socket.emit(events.startMinecraft)
	}
	stopMinecraft() {
		this.#socket.emit(events.stopMinecraft)
	}
	sendMinecraft() {
		this.#socket.emit(events.sendMinecraft, 'help')
	}
	set state(state) {
		this.#state = state
		this.#changeScheduler.schedule()
	}
}
