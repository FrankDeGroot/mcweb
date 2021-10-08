import { rename } from 'fs/promises'
import { notify } from '../rpc/notifier.js'
import { getLatest } from './get_latest.js'
import {
	downloadLatest, getPathCurrentServer,
	isCurrentLatest, restartIfNeeded
} from './update_steps.js'

export async function update(version) {
	notify(`Updating ${version}`)
	const serverInfo = await getLatest(version)
	const pathCurrent = getPathCurrentServer(version, serverInfo)
	if (await isCurrentLatest(pathCurrent, serverInfo)) {
		notify(`Current ${version} is already ${serverInfo.latest}`)
		return
	}
	notify(`Downloading ${version} ${serverInfo.latest}`)
	const pathLatest = await downloadLatest(version, serverInfo)
	await restartIfNeeded(version, serverInfo.latest, async () => {
		notify('Replacing server.jar')
		await rename(pathLatest, pathCurrent)
	})
}
