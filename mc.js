const { log } = require('./log')
const {
	currentVersionPath,
	currentWorldPath,
	directoryFilter,
	isVersion,
	isWorld,
	readCurrent,
	serverDir,
	setVersion,
	setWorld,
	versionPath
} = require('./mcfs')
const { start, stop } = require('./mcservice')
const { say } = require('./rcon')
const { sleep } = require('./sleep')
const { badRequest } = require('./error.js')

let changing = false

exports.versions = async () => directoryFilter(serverDir, isVersion)

exports.currentVersion = async () => readCurrent(currentVersionPath)

exports.worlds = async version => directoryFilter(versionPath(version), isWorld)

exports.currentWorld = async version => readCurrent(currentWorldPath(version))

exports.change = async (version, world, onchange) => {
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

