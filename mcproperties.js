const { readFile } = require('fs').promises
const { join } = require('path')

const { serverDir } = require('./mcfs')

exports.readServerProperties = async () => {
	const serverProperties = await readFile(join(serverDir, 'common', 'server.properties'), 'utf8')
	return serverProperties.split(/[\r\n]+/)
		.filter(line => line && !line.startsWith('#'))
		.reduce((acc, line) => {
			const [ key, ...value ] = line.split(/=/)
			acc[key] = value.join('=')
			return acc 
		}, {})
}
