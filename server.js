#!/usr/bin/node
'use strict'

const io = require('socket.io')
const {
	versions,
	currentVersion,
	worlds,
	currentWorld,
} = require('./mcget')
const {
	change,
} = require('./mcset')
const { info, level, log } = require('./log')
const {
	badRequest,
	notFound,
	isCustom,
} = require('./error')

level('info')

async function emit(socket, name, buildMessage) {
	try {
		const message = await buildMessage();
		socket.emit(name, message)
	} catch(err) {
		const message = isCustom(err.code) ? err.message : 'An internal error occurred'
		log(isCustom(err.code) ? 'info': 'error', err)
		socket.emit('throw', message)
	}
}

const server = require('http').createServer()

io(server).on('connection', socket => socket
		.on('worlds', async version =>
			emit(socket, 'worlds', async () => ({
				worlds: await worlds(version),
				world: await currentWorld(version)
			}))
		)
		.on('current', async () =>
			emit(socket, 'current', async () => {
				const version = await currentVersion()
				return {
					versions: await versions(),
					version: version,
					worlds: await worlds(version),
					world: await currentWorld(version)
				}
			})
		)
		.on('change', async changeParameters => {
			const { version, world } = changeParameters
			socket.emit('changing')
			await change(version, world, message => {
				socket.emit('message', message)
			})
			socket.emit('changed')
		})
)

server.listen(1024, err => {
	if (err) throw err;
	info('Server running')
})

