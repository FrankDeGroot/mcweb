import { symlink, unlink } from 'fs/promises'
import { apiMinecraftRunner } from '../api_mc_runner.js'
import { notify } from '../rpc/notifier.js'
import {
	getCurrentVersionPath,
	getCurrentWorldPath
} from './paths.js'
import {
	getCurrentVersion,
	getCurrentWorld
} from './read.js'

export async function change({ version, world }) {
	const currentVersion = await getCurrentVersion()
	const currentWorld = await getCurrentWorld(version)
	if (version === currentVersion && world === currentWorld) {
		notify('Already current')
		return
	}
	await apiMinecraftRunner.restart(`Switching to ${version} with ${world}`, async () => {
		await setVersion(version)
		await setWorld(version, world)
	})
}

async function setVersion(version) {
	await unlink(getCurrentVersionPath())
	await symlink(version, getCurrentVersionPath())
}

async function setWorld(version, world) {
	const path = getCurrentWorldPath(version)
	await unlink(path)
	await symlink(world, path)
}
