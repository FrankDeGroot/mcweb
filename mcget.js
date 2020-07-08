'use strict'

const fs = require('fs')
const { constants } = fs
const { access, lstat, readdir, readlink } = fs.promises
const { join } = require('path')
const { notFound } = require('./error')
const {
	currentVersionPath,
	currentWorldPath,
	serverPath,
	versionPath
} = require('./mcpaths')

exports.currentVersion = async () => readCurrent(currentVersionPath)
exports.currentWorld = async version => readCurrent(currentWorldPath(version))
exports.versions = async () => directoryFilter(serverPath, isVersion)
exports.worlds = async version => directoryFilter(versionPath(version), isWorld)

async function directoryFilter(path, filter) {
	try {
		const names = await readdir(path)
		const filtered = await Promise.all(names
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

