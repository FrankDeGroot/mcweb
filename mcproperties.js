const { readFile } = require('fs').promises
const { join } = require('path')

const { serverPath } = require('./mcpaths')

exports.readServerProperties = async () => {
	const serverProperties = await readFile(join(serverPath, 'common', 'server.properties'), 'utf8')
	return serverProperties.split(/[\r\n]+/)
		.filter(line => line && !line.startsWith('#'))
		.reduce((acc, line) => {
			const [ key, ...value ] = line.split(/=/)
			acc[key] = value.join('=')
			return acc 
		}, {})
}
