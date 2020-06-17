const fs = require('fs')
const { promisify } = require('util')

const readlink = promisify(fs.readlink)

const { join } = require('path')

const { log } = require('./log')
const {
	currentVersionPath,
	currentWorldPath,
	directoryFilter,
	isVersion,
	isWorld,
	serverDir,
	setVersion,
	setWorld,
	versionPath
} = require('./mcfs')
const { start, stop } = require('./mcservice')
const { say } = require('./rcon')
const { sleep } = require('./sleep')

let changing = false

exports.versions = async () => directoryFilter(serverDir, isVersion)

exports.currentVersion = async () => readlink(currentVersionPath)

exports.worlds = async version => directoryFilter(versionPath(version), isWorld)

exports.currentWorld = async version => readlink(currentWorldPath(version))

const alreadyChangingErrorCode = 'ALREADYCHANGING'
exports.alreadyChangingError = alreadyChangingErrorCode 

exports.change = async (version, world, onchange) => {
	if (changing) {
		throw { code: alreadyChangingErrorCode }
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

