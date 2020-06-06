const fs = require('fs')
const { promisify } = require('util')
const readFile = promisify(fs.readFile)
const { join } = require('path')

const { serverDir } = require('./mcfs')

exports.readServerProperties = async () => {
	const propertiesFiles = await readFile(join(serverDir, 'common', 'server.properties'), 'utf8')
	return propertiesFiles.split(/[\r\n]+/)
		.filter(line => line && !line.startsWith('#'))
		.reduce((acc, line) => {
			const [ key, value ] = line.split(/=/)
			acc[key] = value
			return acc 
		}, {})
}
