'use strict'

const { log } = require('./log')
const {
	badRequest,
	notFound,
	isCustom,
} = require('./error')

const {
	versions,
	currentVersion,
	worlds,
	currentWorld,
} = require('./mcget')
const {
	change,
} = require('./mcset')
const {
	update
} = require('./update')

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
			progressive(socket, 'changing', 'changed', async () => {
				const { version, world } = changeParameters
				await change(version, world, message => socket.emit('message', message))
			})
		})
		.on('update', async updateParameters => {
			progressive(socket, 'updating', 'updated', async () => {
				const { version } = updateParameters
				await update(version, message => socket.emit('message', message))
			})
		})

async function progressive(socket, doing, done, action) {
	socket.emit(doing)
	try {
		await action()
	} catch(err) {
		catchErr(socket, err)
	} finally {
		socket.emit(done)
	}
}

async function emit(socket, name, buildMessage) {
	try {
		socket.emit(name, await buildMessage())
	} catch(err) {
		catchErr(socket, err)
	}
}

async function catchErr(socket, err) {
		const message = isCustom(err.code) ? err.message : 'An internal error occurred'
		log(isCustom(err.code) ? 'info': 'error', err)
		socket.emit('throw', message)
}

