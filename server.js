#!/usr/bin/node

const { json } = require('body-parser')
const {
	versions,
	currentVersion,
	worlds,
	currentWorld,
	alreadyChangingErrorCode,
	change
} = require('./mc')
const { log } = require('./log')

function send(res, status, body) {
	res.writeHead(status, {'Content-Type': 'application/json'})
	res.end(JSON.stringify(body))
}

function handler() {
	return require('polka')()
		.use(json())
		.use('api', async (req, res, next) => {
			try {
				next()
				send(res, 200, await res.body)
			} catch(err) {
				if (err.code === alreadyChangingErrorCode) {
					send(res, 400, { message: 'Already changing' })
				} else {
					log(err)
					send(res, 500, { message: 'Internal Server Error' })
				}
			}
		})
		.put('api', (req, res) => {
			const { version, world } = req.body
			res.body = (async () => {
				await change(version, world)
				return { done: 'true' }
			})()
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
}

(async () => {
	require('http').createServer(handler()).listen(1024, () => {
			console.log('Server running')
	})
})()

