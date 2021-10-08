import * as ipcEvents from '../all/ipc_events.js'
import { ipcRelay } from '../all/ipc_relay.js'
import { state, stateUpdatedEvent } from '../all/state.js'
import * as webEvents from '../web/events.js'
import { apiMinecraftRunner, removeTimeAndThread } from './api_mc_runner.js'
import { getOperators } from './players/operators.js'
import { SocketWrapper } from './rpc/socket_wrapper.js'
import { server } from './server.js'
import { update } from './update/update.js'
import { gamerulesStateHandler, setGamerules } from './worlds/gamerules.js'
import { getCurrentVersion } from './worlds/read.js'
import { getVersionsWorlds } from './worlds/versions_worlds.js'

state.update({
	versions: await getVersionsWorlds(),
	version: await getCurrentVersion(),
	operators: await getOperators(),
})
server.on('connection', async socket => {
	const socketWrapper = new SocketWrapper(socket)
	socketWrapper
		.on(webEvents.startMinecraft, async version => await apiMinecraftRunner.start(version))
		.on(webEvents.stopMinecraft, async () => await apiMinecraftRunner.stop())
		.on(webEvents.sendMinecraft, async request => await apiMinecraftRunner.send(request))
		.on(webEvents.update, async ({ version }) => update(version))
		.on(webEvents.setGamerules, async (...args) => await setGamerules(...args))
	socket
		.emit(webEvents.state, state.current)
})
state
	.on(stateUpdatedEvent, delta => server.emit(webEvents.state, delta))
ipcRelay.process = process
ipcRelay
	.on(ipcEvents.reloadWeb, () => server.emit(webEvents.reload))
	.on(ipcEvents.state, delta => state.update(delta))
	.on(ipcEvents.state, delta => gamerulesStateHandler(delta))
	.on(ipcEvents.receiveMinecraft, response => server.emit(webEvents.receiveMinecraft, removeTimeAndThread(response)))
	.on(ipcEvents.errorNotification, err => server.emit(webEvents.errorNotification, err))
	.emit(ipcEvents.apiReady)
