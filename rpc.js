'use strict'

const {
	versions,
	currentVersion,
	worlds,
	currentWorld,
} = require('./mcget')
const {
	change,
} = require('./mcset')
const { log } = require('./log')
const {
	badRequest,
	notFound,
	isCustom,
} = require('./error')

exports.setup = socket => socket
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

async function emit(socket, name, buildMessage) {
	try {
		socket.emit(name, await buildMessage())
	} catch(err) {
		const message = isCustom(err.code) ? err.message : 'An internal error occurred'
		log(isCustom(err.code) ? 'info': 'error', err)
		socket.emit('throw', message)
	}
}

