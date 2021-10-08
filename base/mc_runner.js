import { spawn } from 'child_process'
import { EventEmitter } from 'events'
import { join } from 'path'
import { receiveMinecraft } from '../all/ipc_events.js'
import { mcPath } from '../all/config.js'

const { error, info } = console

export const minecraftServerStateEvent = 'minecraftServerState'

export class MinecraftRunner extends EventEmitter {
	#minecraftServer

	on(event, ...args) {
		super.on(event, ...args)
		if (event === minecraftServerStateEvent) {
			this.#emitServerStateEvent('stopped')
		}
		return this
	}

	start() {
		if (this.#minecraftServer) {
			throw new Error('Already started')
		}
		this.#minecraftServer = spawn('java', ['-jar', 'server.jar'], {
			cwd: join(mcPath, 'current'),
			detached: true,
			stdio: ['pipe', 'pipe', 'inherit']
		})
		this.#minecraftServer
			.on('close', (code, signal) => {
				if (code || code === 0) {
					info('Minecraft stopped with code', code)
				}
				if (signal) {
					info('Minecraft stopped with signal', signal)
				}
				this.#emitServerStateEvent('stopped')
				this.#minecraftServer = null
			})
			.on('error', err => {
				error('Failed starting Minecraft server', err)
				this.#emitServerStateEvent(err)
			})
			.on('spawn', () => {
				this.#minecraftServer.stdout
					.on('data', this.#detectStarted)
					.on('data', data => this.emit(receiveMinecraft, data.toString()))
					.pipe(process.stdout)
			})
		this.#emitServerStateEvent('starting')
	}

	stop() {
		if (this.#minecraftServer) {
			this.#emitServerStateEvent('stopping')
			this.send('stop')
		}
	}

	exit() {
		if (this.#minecraftServer) {
			this.stop()
			return new Promise(resolve => {
				this.#minecraftServer.on('close', resolve)
			})
		}
	}

	send(request) {
		if (this.#minecraftServer) {
			this.#minecraftServer.stdin.write(request + '\n')
		} else {
			throw new Error(`Cannot send '${request}'. Minecraft server not running.`)
		}
	}

	#emitServerStateEvent(state) {
		this.emit(minecraftServerStateEvent, state)
	}

	#detectStarted = data => {
		if (data.toString().match(/: Done/)) {
			this.#minecraftServer.stdout.off('data', this.#detectStarted)
			this.#emitServerStateEvent('started')
		}
	}
}

export const minecraftRunner = new MinecraftRunner()
