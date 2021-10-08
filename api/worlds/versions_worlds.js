import {
	getCurrentWorld,
	getVersions,
	getWorlds
} from '../worlds/read.js'

export async function getVersionsWorlds() {
	const versions = await getVersions()
	const versionWorlds = await Promise.all(versions.map(async version => ({
		[version]: {
			worlds: await getWorlds(version),
			world: await getCurrentWorld(version)
		}
	})))
	return versionWorlds.reduce((acc, version) => ({ ...acc, ...version }), {})
}
