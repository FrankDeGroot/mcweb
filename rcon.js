let con = null

async function connect() {
	if (!con) {
		const serverProperties = await require('./mcproperties.js').readServerProperties()
	
		con = new require('rcon')('localhost', serverProperties['rcon.port'], serverProperties['rcon.password'], {
			tcp: true,
			challenge: false
		})
			.on('auth', () => console.log('Authenticated to rcon MC'))
			.on('error', err => console.error(err))
	
		con.connect()
	}
}

exports.say = async message => {
	if (!con) {
		await connect()
	}
	console.log('Saying', message)
	try {
		con.send('say ' + message)
	} catch (err) {
		console.error(err)
	}
}

