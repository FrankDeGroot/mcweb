import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { getCommonPath } from './paths.js'

export async function readServerProperties() {
	const serverProperties = await readFile(serverPropertiesFileName(), 'utf8')
	return serverProperties.split(/[\r\n]+/)
		.filter(line => line && !line.startsWith('#'))
		.reduce((acc, line) => {
			const [key, ...value] = line.split(/=/)
			acc[key] = value.join('=')
			return acc
		}, {})
}

export async function writeServerProperties(serverProperties) {
	await writeFile(serverPropertiesFileName(), Object.entries(serverProperties).sort()
		.map(([key, value]) => `${key}=${value}`)
		.join('\n'), 'utf8')
}

function serverPropertiesFileName() {
	return join(getCommonPath(), 'server.properties')
}
