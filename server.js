#!/usr/bin/node

const fs = require('fs')
const { join } = require('path')
const { promisify } = require('util')

const readFile = promisify(fs.readFile)
const readdir = promisify(fs.readdir)
const readlink = promisify(fs.readlink)
const lstat = promisify(fs.lstat)

async function access(path) {
	return new Promise((resolve, reject) => fs.access(path, err => !err ? resolve(true) : err.code === 'ENOENT' ? resolve(false): reject(err)))
}

const serverDir = '../server'
const currentVersionName = 'current'
const currentWorldName = 'world'

function versionPath(version) {
	return join(serverDir, version)
}

async function versions() {
	return directoryFilter(serverDir, isVersion)
}

async function currentVersion() {
	return readlink(versionPath(currentVersionName))
}

async function worlds(version) {
	return directoryFilter(versionPath(version), isWorld)
}

async function currentWorld(version) {
	return readlink(join(versionPath(version), currentWorldName))
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

(async () => {
	const { pemPath, port } = require('./.config')
	const { createServer } = require(pemPath ? 'https': 'http')
	const { json } = require('body-parser')
	const options = pemPath ? {
		key: await readFile(pemPath + '/privkey.pem'),
		cert: await readFile(pemPath + '/cert.pem')
	} : {}
	createServer(options, require('polka')()
		.use(require('sirv')('public'))
		.use(json())
		.use('api', async (req, res, next) => {
			function send(status, body) {
				res.writeHead(status, {'Content-Type': 'application/json'})
				res.end(JSON.stringify(body))
			}
			try {
				next()
				send(200, await res.body)
			} catch(err) {
				console.error(err)
				send(500, {})
			}
		})
		.put('api', (req, res) => {
			console.log(req.body)
		})
		.get('api/versions', (req, res) => {
			res.body = versions()
		})
		.get('api/versions/current', (req, res) => {
			res.body = currentVersion()
		})
		.get('api/versions/:version/worlds', (req, res) => {
			res.body = worlds(req.params.version)
		})
		.get('api/versions/:version/worlds/current', (req, res) => {
			res.body = currentWorld(req.params.version)
		})
		.handler
	).listen(port || (pemPath ? 443 : 80), () => {
			console.log('Server running')
	})
})()

