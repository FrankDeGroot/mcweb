import { fork } from 'child_process'
import { EventEmitter } from 'events'

const { error, info } = console

export const apiStartedEvent = 'apiStarted'

export class ApiRunner extends EventEmitter {
	#apiProcess = null

	restartApi() {
		if (this.#apiProcess) {
			info('Killing API Process')
			this.#apiProcess.kill()
		} else {
			this.startApi()
		}
	}

	startApi() {
		info('Spawning API Process')
		this.#apiProcess = fork('api', ['--unhandled-rejections=strict'], {
			detached: true,
			stdio: ['pipe', 'inherit', 'inherit', 'ipc']
		})
			.on('error', err => {
				error('API Process spawn error', err)
			})
			.on('close', this.#restartOnClose)
		this.emit(apiStartedEvent, this.#apiProcess)
	}

	stopApi() {
		if (this.#apiProcess) {
			this.#apiProcess.off('close', this.#restartOnClose)
			this.#apiProcess.kill()
		}
	}

	#restartOnClose = (code, signal) => {
		this.#apiProcess = null
		if (signal) {
			info('API Process killed with', signal)
		} else {
			info('API Process exited with', code)
			if (code) {
				info('Waiting for error to be fixed before restarting')
				return
			}
		}
		this.startApi()
	}
}

export const apiRunner = new ApiRunner()
