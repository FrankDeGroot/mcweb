import { createReadStream, createWriteStream } from 'fs'
import { unlink } from 'fs/promises'
import { join } from 'path'
import { state } from '../../all/state.js'
import { apiMinecraftRunner } from '../api_mc_runner.js'
import { getVersionPath } from '../worlds/paths.js'
import { getCurrentVersion } from '../worlds/read.js'
import { getSha1 } from './get_sha1.js'
import { getStream } from './get_stream.js'
import { pipe } from './pipe.js'

export function getPathCurrentServer(version, serverInfo) {
	return join(getVersionPath(version), 'server.jar')
}

export async function isCurrentLatest(pathCurrent, serverInfo) {
	return await hasSha1(pathCurrent, serverInfo.sha1)
}

export async function downloadLatest(version, serverInfo) {
	const pathLatest = join(getVersionPath(version), `server.${serverInfo.latest}.jar`)
	await pipe(await getStream(serverInfo.url), createWriteStream(pathLatest))
	if (!await hasSha1(pathLatest, serverInfo.sha1)) {
		await unlink(pathLatest)
		throw new Error(`Latest ${version} ${serverInfo.latest} download failed`)
	}
	return pathLatest
}

export async function restartIfNeeded(version, latest, reconfigure) {
	if (state.current.server != 'stopped' && version === await getCurrentVersion()) {
		apiMinecraftRunner.restart(`Upgrading to ${latest}`, reconfigure)
	} else {
		await reconfigure()
	}
}

async function hasSha1(path, sha1) {
	return sha1 === await getSha1(createReadStream(path))
}
