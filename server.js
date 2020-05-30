#!/usr/bin/node

(async () => {
	const fs = require('fs')
	const { promisify } = require('util')
	const readFile = promisify(fs.readFile)
	const mc = require('./mc')
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
			const { version, world } = req.body
			mc.change(version, world)
		})
		.get('api/versions', (req, res) => {
			res.body = mc.versions()
		})
		.get('api/versions/current', (req, res) => {
			res.body = mc.currentVersion()
		})
		.get('api/versions/:version/worlds', (req, res) => {
			res.body = mc.worlds(req.params.version)
		})
		.get('api/versions/:version/worlds/current', (req, res) => {
			res.body = mc.currentWorld(req.params.version)
		})
		.handler
	).listen(port || (pemPath ? 443 : 80), () => {
			console.log('Server running')
	})
})()

