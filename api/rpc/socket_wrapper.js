import { doIfNotBusy } from './busy_lock.js'
import { notifyThrow } from './notifier.js'

export class SocketWrapper {
	#socket

	constructor(socket) {
		this.#socket = socket
	}

	on(name, action) {
		this.#socket.on(name, async (...args) =>
			await notifyThrow(async () =>
				await doIfNotBusy(async () =>
					await action(...args))))
		return this
	}
}
