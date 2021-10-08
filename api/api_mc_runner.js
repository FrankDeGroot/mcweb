import * as ipcEvents from '../all/ipc_events.js'
import { ipcRelay } from '../all/ipc_relay.js'
import { notify } from './rpc/notifier.js'
import { sleep } from './sleep.js'

export class ApiMinecraftRunner {
	async start() {
		return new Promise((resolve, reject) => {
			const handler = delta => {
				switch (delta.server) {
					case 'starting':
						return
					case 'started':
						ipcRelay.off(ipcEvents.state, handler)
						resolve()
						return
					default:
						ipcRelay.off(ipcEvents.state, handler)
						reject(delta.server)
						return
				}
			}
			ipcRelay
				.on(ipcEvents.state, handler)
				.emit(ipcEvents.startMinecraft)
		})
	}

	async stop() {
		return new Promise((resolve, reject) => {
			const handler = delta => {
				switch (delta.server) {
					case 'stopping':
						return;
					case 'stopped':
						ipcRelay.off(ipcEvents.state, handler)
						resolve()
						return
					default:
						ipcRelay.off(ipcEvents.state, handler)
						reject()
						return
				}
			}
			ipcRelay
				.on(ipcEvents.state, handler)
				.emit(ipcEvents.stopMinecraft)
		})
	}

	async send(request) {
		return new Promise((resolve, reject) => {
			try {
				const resolver = response => {
					ipcRelay.off(ipcEvents.relayedError, rejecter)
					resolve(removeTimeAndThread(response))
				}
				const rejecter = err => {
					ipcRelay.off(ipcEvents.receiveMinecraft, resolver)
					reject(err)
				}
				ipcRelay
					.once(ipcEvents.receiveMinecraft, resolver)
					.once(ipcEvents.relayedError, rejecter)
					.emit(ipcEvents.sendMinecraft, request)
			} catch (err) {
				reject(err)
			}
		})
	}

	async say(message) {
		await this.send(`say ${message}`)
	}

	async restart(reason, reconfigure) {
		notify('Send warning to players and wait')
		await this.say(`${reason} in 2 seconds.`)
		await sleep(2000)
		notify('Stopping Minecraft')
		await this.stop()
		notify('Reconfiguring')
		if (reconfigure) reconfigure()
		notify('Starting Minecraft')
		await this.start()
		notify('Waiting for Minecraft')
		await this.say('Welcome back!')
		notify('Done')
	}

}

export function removeTimeAndThread(response) {
	const separatorIndex = response.indexOf(': ')
	return separatorIndex === -1 ? response : response.substring(separatorIndex + 2)
}

export const apiMinecraftRunner = new ApiMinecraftRunner()
