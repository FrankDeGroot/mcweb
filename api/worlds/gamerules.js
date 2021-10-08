import { state } from '../../all/state.js'
import { apiMinecraftRunner } from '../api_mc_runner.js'
import { getGamerulesDefinitions } from './list_gamerules.js'

export async function gamerulesStateHandler(delta) {
	switch (delta.server) {
		case 'started':
			state.update({
				gamerules: await getGamerules()
			})
			break
		case 'stopping':
			state.update({
				gamerules: getGamerulesDefinitions()
			})
			break
	}
}

async function getGamerules() {
	return Object.entries(getGamerulesDefinitions()).reduce(async (previousPromise, [key, definition]) => {
		const gamerules = await previousPromise
		const gamerule = await getGamerule(key, definition)
		return gamerule ? { ...gamerules, ...gamerule } : gamerules
	}, Promise.resolve({}))
}

export async function setGamerules(gamerules) {
	await Object.entries(gamerules).reduce(async (previousPromise, [key, { value }]) => {
		await previousPromise
		await apiMinecraftRunner.send(`gamerule ${key} ${value}`)
	}, Promise.resolve())
}

async function getGamerule(gamerule, definition) {
	const response = await apiMinecraftRunner.send('gamerule ' + gamerule)
	const separatorIndex = response.indexOf(': ')
	if (separatorIndex !== -1) {
		const value = parse(response.substring(separatorIndex + 2), definition.type)
		definition.value = value
	}
	return {
		[gamerule]: definition
	}
}

function parse(value, type) {
	switch (type) {
		case 'boolean': return JSON.parse(value)
		case 'integer': return parseInt(value, 10)
		default: throw new Error(`Unknown gamerule type '${type}'.`)
	}
}
