const fs = require('fs')
const { join } = require('path')
const { promisify } = require('util')

const readdir = promisify(fs.readdir)
const lstat = promisify(fs.lstat)
const unlink = promisify(fs.unlink)
const symlink = promisify(fs.symlink)

const serverDir = join('..', 'server')
const currentVersionName = 'current'
const currentWorldName = 'world'
const currentVersionPath = versionPath(currentVersionName)

exports.serverDir = serverDir

exports.directoryFilter =  async (path, filter) => {
	const dirs = await readdir(path)
	const filtered = await Promise.all(dirs
		.map(async name => {
			const filtered = await filter(join(path, name))  
			return filtered ? name: null
		}))
	return filtered 
		.filter(name => name)
}

exports.versionPath = versionPath

exports.currentVersionPath = currentVersionPath

exports.currentWorldPath = currentWorldPath

exports.isVersion = async path => hasFile(path, 'server.jar')

exports.isWorld = async path => hasFile(path, 'level.dat')

exports.setVersion = async version => {
	await unlink(currentVersionPath)
	await symlink(version, currentVersionPath)
}

exports.setWorld = async (version, world) => {
	const path = currentWorldPath(version)
	await unlink(path)
	await symlink(world, path)
}

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

