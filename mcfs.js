const fs = require('fs')
const { constants } = fs
const { access, lstat, readdir, readlink, symlink, unlink } = fs.promises
const { join } = require('path')
const { notFound } = require('./error.js')

const serverDir = join('..', 'server')
const currentVersionName = 'current'
const currentWorldName = 'world'
const currentVersionPath = versionPath(currentVersionName)

exports.currentVersionPath = currentVersionPath

exports.currentWorldPath = currentWorldPath

exports.directoryFilter = async (path, filter) => {
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

exports.isVersion = async path => hasFile(path, 'server.jar')

exports.isWorld = async path => hasFile(path, 'level.dat')

exports.readCurrent = async path => {
	try {
		return await readlink(path)
	} catch(err) {
		if (err.code === 'ENOENT') {
			throw { code: notFound, message: 'Unknown path' }
		}
		throw err
	}
}

exports.serverDir = serverDir

exports.setVersion = async version => {
	await unlink(currentVersionPath)
	await symlink(version, currentVersionPath)
}

exports.setWorld = async (version, world) => {
	const path = currentWorldPath(version)
	await unlink(path)
	await symlink(world, path)
}

exports.versionPath = versionPath

function currentWorldPath(version) {
	return join(versionPath(version), currentWorldName)
}

function versionPath(version) {
	return join(serverDir, version)
}

async function hasFile(path, file) {
	return (await lstat(path)).isDirectory() && (await exists(join(path, file)))
}

async function exists(path) {
	try {
		await access(path, constants.R_OK)
		return true
	} catch(err) {
		return err.code === 'ENOENT'
	}
}

