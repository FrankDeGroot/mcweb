'use strict'

const { symlink, unlink } = require('fs').promises
const { log } = require('./log')
const {
	currentVersionPath,
	currentWorldPath,
	serverPath,
	versionPath,
} = require('./mcpaths')
const {
	currentVersion,
	currentWorld,
} = require('./mcget')
const { start, stop } = require('./mcservice')
const { say } = require('./mcrcon')
const { sleep } = require('./sleep')
const { badRequest } = require('./error')

let changing = false

exports.change = async (version, world, onchange) => {
	const nowVersion = await currentVersion()
	const nowWorld = await currentWorld(version)
	if (version === nowVersion && world === nowWorld) {
		onchange('Already current')
		return
	}
	if (changing) {
		throw { code: badRequest, message: 'Already changing version/world' }
	}
	try {
		changing = true
		onchange('Send warning to players and wait')
		await say(`Switching to ${version} with ${world} in 2 s, see you there!`)
		await sleep(2000)
		onchange('Stopping Minecraft')
		log('stopping mc')
		await stop()
		onchange('Reconfiguring')
		await setVersion(version)
		await setWorld(version, world)
		onchange('Starting Minecraft')
		log('starting mc')
		await start()
		onchange('Waiting for Minecraft')
		await say(`Welcome back!`)
		onchange('Done!')
		changing = false
	} catch(err) {
		changing = false
		throw err
	}
}

async function setVersion(version) {
	await unlink(currentVersionPath)
	await symlink(version, currentVersionPath)
}

async function setWorld(version, world) {
	const path = currentWorldPath(version)
	await unlink(path)
	await symlink(world, path)
}

