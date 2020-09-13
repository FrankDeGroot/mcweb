'use strict'

const https = require('https')
const crypto = require('crypto')
const { rename, writeFile } = require('fs').promises
const { join } = require('path')
const { info } = require('./log')
const { versionPath } = require('./mcpaths')
const { start, stop } = require('./mcservice')
const { say } = require('./mcrcon')
const { sleep } = require('./sleep')
const { currentVersion } = require('./mcget')

exports.update = async (version, onchange) => {
	info('updating', version)
	const history = await getJson('https://launchermeta.mojang.com/mc/game/version_manifest.json')
	const latest = history.latest[version];
	info('latest', version, 'is', latest)
	const versionInfoUrl = history.versions.find(entry => entry.id === latest).url
	const versionInfo = await getJson(versionInfoUrl)
	const serverInfo = versionInfo.downloads.server
	const serverUrl = serverInfo.url
	const serverSha1 = serverInfo.sha1
	onchange(`Downloading ${version} ${latest} at ${serverUrl}`)
	info(`downloading ${version} ${latest} at ${serverUrl}`)
	const serverJar = await get(serverUrl)
	if (serverSha1 !== crypto.createHash('sha1').update(serverJar).digest('hex')) {
		throw { code: 'DOWNLOADFAILED', message: `Latest ${version} ${latest} download sha1 does not match` }	
	}
	const serverLatestPath = join(versionPath(version), `server.${latest}.jar`)
	await writeFile(serverLatestPath, serverJar)
	await restartIfCurrent(version, latest, async () => {
		onchange('Replacing server')
		info('replacing server.jar')
		await rename(serverLatestPath, join(versionPath(version), 'server.jar'))
	}, onchange)
}

async function restartIfCurrent(version, latest, action, onchange) {
	if (version === await currentVersion()) {
		await say(`Upgrading to ${latest} in 2 s`)
		await sleep(2000)
		onchange('Stopping Minecraft')
		info('stopping mc')
		await stop()

		await action()

		onchange('Starting Minecraft')
		info('starting mc')
		await start()
		onchange('Waiting for Minecraft')
		info('waiting for mc')
		await say('Welcome back!')
		onchange('done')
	} else {
		await action()
	}
}

async function getJson(url) {
	const buffer = await get(url)
	return JSON.parse(buffer.toString())
}

async function get(url) {
	return new Promise((resolve, reject) => {
		https.get(url, res => {
			const chunks = []
			res
				.on('data', chunk => {
					chunks.push(chunk)
				})
				.on('end', () => resolve(Buffer.concat(chunks)))
				.on('error', body => reject(err))
		})
	})
}
