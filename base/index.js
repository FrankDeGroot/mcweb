import chokidar from 'chokidar'
import * as ipcEvents from '../all/ipc_events.js'
import { ipcRelay } from '../all/ipc_relay.js'
import { state, stateUpdatedEvent } from '../all/state.js'
import { apiRunner, apiStartedEvent } from './api_runner.js'
import { minecraftRunner, minecraftServerStateEvent } from './mc_runner.js'

const { error } = console

minecraftRunner
	.on(minecraftServerStateEvent, minecraftServerState => state.update({ server: minecraftServerState }))
	.on(ipcEvents.receiveMinecraft, response => ipcRelay.emit(ipcEvents.receiveMinecraft, response))
ipcRelay
	.on(ipcEvents.apiReady, () => ipcRelay.emit(ipcEvents.state, state.current))
	.on(ipcEvents.startMinecraft, () => minecraftRunner.start())
	.on(ipcEvents.stopMinecraft, () => minecraftRunner.stop())
	.on(ipcEvents.sendMinecraft, request => minecraftRunner.send(request))
state
	.on(stateUpdatedEvent, delta => ipcRelay.emit(ipcEvents.state, delta))
apiRunner
	.on(apiStartedEvent, apiProcess => {
		ipcRelay.process = apiProcess
	})
const apiWatcher = chokidar.watch(['all', 'api']).on('ready', () => {
	apiWatcher.on('all', () => apiRunner.restartApi())
})
const webWatcher = chokidar.watch('web').on('ready', () => {
	webWatcher.on('all', () => ipcRelay.emit(ipcEvents.reloadWeb))
})
process
	.on('SIGINT', cleanExit)
	.on('uncaughtException', cleanExit)
	.on('unhandledRejection', cleanExit)
	.stdin.on('data', cleanExit)
apiRunner.startApi()

async function cleanExit(reason) {
	if (reason) {
		error(reason.toString())
	}
	if (apiRunner) {
		apiRunner.stopApi()
	}
	if (minecraftRunner) {
		await minecraftRunner.exit()
	}
	process.exit()
}
