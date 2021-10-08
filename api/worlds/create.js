import { mkdir, symlink, unlink } from 'fs/promises'
import { apiMinecraftRunner } from '../api_mc_runner.js'
import { getCurrentWorldPath, getWorldPath } from './paths'
import { readServerProperties, writeServerProperties } from './serverproperties.js'

export async function create({ version, world, seed }) {
	const serverProperties = await readServerProperties()
	serverProperties['level-seed'] = seed
	await writeServerProperties(serverProperties)
	await mkdir(getWorldPath(version, world))
	await apiMinecraftRunner.restart('Creating a new world', async () => {
		const path = getCurrentWorldPath(version)
		await unlink(path)
		await symlink(world, path)
	})
}
