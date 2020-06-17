#!/usr/bin/node

const { json } = require('body-parser')
const io = require('socket.io')
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
				log(err)
				send(res, 500, { message: 'Internal Server Error' })
			}
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

const server = require('http').createServer(handler())

io(server).on('connection', socket => {
	socket.emit('message', 'Connected')
	socket.on('change', async changeParameters => {
		const { version, world } = changeParameters
		socket.emit('changing')
		await change(version, world, message => {
//			log('emitting', message)
			socket.emit('message', message)
		})
		socket.emit('changed')
	})
})

server.listen(1024, err => {
		if (err) throw err;
		log('Server running')
})

