const fs = require('fs')
const { constants } = fs
const { access, lstat, readdir, readlink, symlink, unlink } = fs.promises
const { join } = require('path')
const { notFound } = require('./error')
const {
	currentVersionPath,
	currentWorldPath,
	serverPath,
	versionPath
} = require('./mcpaths')

exports.versions = async () => directoryFilter(serverPath, isVersion)

exports.currentVersion = async () => readCurrent(currentVersionPath)

exports.worlds = async version => directoryFilter(versionPath(version), isWorld)

exports.currentWorld = async version => readCurrent(currentWorldPath(version))

async function directoryFilter(path, filter) {
	try {
	const dirs = await readdir(path)
	const filtered = await Promise.all(dirs
		.map(async name => {
			const filtered = await filter(join(path, name))  
			return filtered ? name: null
		}))
	return filtered 
		.filter(name => name)
	} catch(err) {
		if (err.code === 'ENOENT') {
			throw { code: notFound, message: 'Unknown path' }
		} 
		throw err
	}
}

async function isVersion(path) {
	return hasFile(path, 'server.jar')
}

async function isWorld(path) {
	return hasFile(path, 'level.dat')
}

async function readCurrent(path) {
	try {
		return await readlink(path)
	} catch(err) {
		if (err.code === 'ENOENT') {
			throw { code: notFound, message: 'Unknown path' }
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
	} catch(err) {
		if (err.code === 'ENOENT') {
			return false
		}
		throw err
	}
}

