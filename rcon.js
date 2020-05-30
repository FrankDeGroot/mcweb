(async () => {
	const fs = require('fs')
	const { promisify } = require('util')
	const readFile = promisify(fs.readFile)
	const { join } = require('path')

	const propertiesFiles = await readFile(join('..', 'server', 'common', 'server.properties'), 'utf8')
	const serverProperties = propertiesFiles.split(/[\r\n]+/)
		.filter(line => line && !line.startsWith('#'))
		.reduce((acc, line) => {
			const [ key, value ] = line.split(/=/)
			acc[key] = value
			return acc 
		}, {})
	
	const con = new require('rcon')('localhost', serverProperties['rcon.port'], serverProperties['rcon.password'], {
		tcp: true,
		challenge: false
	}).on('auth', () => console.log('auth'))
	
	con.connect()
	
	exports.say = (message) => {
		console.log('Saying ', message)
		con.send('say ' + message)
	}
})()

