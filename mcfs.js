const fs = require('fs')
const { join } = require('path')
const { promisify } = require('util')
const { notFound } = require('./error.js')

const readdir = promisify(fs.readdir)
const lstat = promisify(fs.lstat)
const unlink = promisify(fs.unlink)
const symlink = promisify(fs.symlink)
const readlink = promisify(fs.readlink)

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
	return (await lstat(path)).isDirectory() && (await access(join(path, file)))
}

async function access(path) {
	return new Promise((resolve, reject) =>
		fs.access(path, err => !err ?
			resolve(true) : err.code === 'ENOENT' ? resolve(false): reject(err)))
}

