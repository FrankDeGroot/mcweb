import { EventEmitter } from 'events'
import { serializeError } from 'serialize-error'
import * as ipcEvents from './ipc_events.js'

const messageEvent = 'message'

// Send and receive events between parent and child process across an IPC channel.
export class IpcRelay extends EventEmitter {
	#process

	emit(event, ...args) {
		if (this.#process && this.#process.connected) {
			const payload = { event, args: serializeError(args) }
			this.#process.send(payload)
		} else {
			throw new Error(`Unable to emit '${event}'${args ? ` with '${args}'` : ''}. No connected process.`)
		}
	}

	set process(process) {
		if (!process) {
			throw new Error('process cannot be null.')
		}
		if (!process.connected) {
			throw new Error('No IPC channel.')
		}
		if (this.#process) {
			this.#process.off(messageEvent, this.#relay)
		}
		this.#process = process
		this.#process.on(messageEvent, this.#relay)
	}

	#relay = message => {
		const { event, args } = message
		if (!event) {
			throw new Error(`No event specified in IPC message ${message}.`)
		}
		try {
			super.emit(event, ...args)
		} catch (err) {
			const wrappedError = new Error(`Emit '${event}'${args ? ` with '${args}'` : ''} threw ${err}`)
			if (event !== ipcEvents.relayedError) {
				this.emit(ipcEvents.relayedError, wrappedError)
			} else {
				throw wrappedError
			}
		}
	}
}

export const ipcRelay = new IpcRelay()
