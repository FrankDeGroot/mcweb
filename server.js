#!/usr/bin/node

function handler() {
	const mc = require('./mc')
	const { json } = require('body-parser')
	return require('polka')()
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
			res.body = (async () => {
				await mc.change(version, world)
				return { done: 'true' }
			})()
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
}

(async () => {
	require('http').createServer(handler()).listen(1024, () => {
			console.log('Server running')
	})
})()

