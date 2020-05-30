const fs = require('fs')
const { join } = require('path')
const { promisify } = require('util')

const rcon = require('./rcon')

const readdir = promisify(fs.readdir)
const readlink = promisify(fs.readlink)
const lstat = promisify(fs.lstat)

const serverDir = '../server'
const currentVersionName = 'current'
const currentWorldName = 'world'

exports.versions = async () => {
	return directoryFilter(serverDir, isVersion)
}

exports.currentVersion = async () => {
	return readlink(versionPath(currentVersionName))
}

exports.worlds = async version => {
	return directoryFilter(versionPath(version), isWorld)
}

exports.currentWorld = async version => {
	return readlink(join(versionPath(version), currentWorldName))
}

exports.change = async (version, world) => {
	rcon.say(`Switching to ${version} with ${world}, see you there!`)
}

async function access(path) {
	return new Promise((resolve, reject) => fs.access(path, err => !err ? resolve(true) : err.code === 'ENOENT' ? resolve(false): reject(err)))
}

function versionPath(version) {
	return join(serverDir, version)
}

async function directoryFilter(path, filter) {
	const dirs = await readdir(path)
	const filtered = await Promise.all(dirs
		.map(async name => {
			const filtered = await filter(join(path, name))  
			return filtered ? name: null
		}))
	return filtered 
		.filter(name => name)
}

async function isVersion(path) {
	return hasFile(path, 'server.jar')
}

async function isWorld(path) {
	return hasFile(path, 'level.dat')
}

async function hasFile(path, file) {
	return (await lstat(path)).isDirectory() && (await access(join(path, file)))
}


