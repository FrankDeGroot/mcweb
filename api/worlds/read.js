import { constants } from 'fs'
import { access, lstat, readdir, readlink } from 'fs/promises'
import { join } from 'path'
import {
	getCurrentVersionPath,
	getCurrentWorldPath,
	getServerPath,
	getVersionPath
} from './paths.js'

export async function getCurrentVersion() {
	return readCurrent(getCurrentVersionPath())
}

export async function getCurrentWorld(version) {
	readCurrent(getCurrentWorldPath(version))
}

export async function getVersions() {
	return directoryFilter(getServerPath(), isVersion)
}

export async function getWorlds(version) {
	return directoryFilter(getVersionPath(version), isWorld)
}

async function directoryFilter(path, filter) {
	try {
		const names = await readdir(path)
		const filtered = await Promise.all(names
			.map(async name => {
				const filtered = await filter(join(path, name))
				return filtered ? name : null
			}))
		return filtered
			.filter(name => name)
	} catch (err) {
		if (err.code === 'ENOENT') {
			throw new Error(`Unknown path '${path}'`)
		}
		throw err
	}
}

async function isVersion(path) {
	return hasFile(path, 'run.jar')
}

async function isWorld(path) {
	return hasFile(path, 'level.dat')
}

async function readCurrent(path) {
	try {
		return await readlink(path)
	} catch (err) {
		if (err.code === 'ENOENT') {
			throw new Error(`Unknown path '${path}'`)
		}
		throw err
	}
}

async function hasFile(path, file) {
	return (await lstat(path)).isDirectory() && (await exists(join(path, file)))
}

async function exists(path) {
	try {
		await access(path, constants.R_OK)
		return true
	} catch (err) {
		if (err.code === 'ENOENT') {
			return false
		}
		throw err
	}
}
