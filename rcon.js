const Rcon = require('rcon')
const { log } = require('./log')
const { sleep } = require('./sleep')

let serverProperties = null

async function readServerProperties() {
	if (!serverProperties) {
		serverProperties = await require('./mcproperties.js').readServerProperties()
	}
}

function send(message) {
	return new Promise((resolve, reject) => {
		const con = new Rcon('localhost', serverProperties['rcon.port'], serverProperties['rcon.password'], {
			tcp: true,
			challenge: false
		})
			.on('auth', () => con.send(message))
			.on('end', () => resolve())
			.on('error', err => reject(err))
			.on('response', response => {
				if (response) {
					log('rcon response', response)
				}
				con.disconnect()
			})
		con.connect()
	})
}

exports.say = async message => {
	await readServerProperties()
	let tries = 0
	let done = false
	do {
		tries++
		try {
			log('Saying', message, 'attempt', tries)
			await send('say ' + message)
			done = true
			log('Said', message)
		} catch(err) {
			if (err.code === 'ECONNREFUSED') {
				log('Failed saying', message, 'attempt', tries)
				await sleep(1000)
			} else {
				throw err
			}
		}
	} while (!done && tries < 120)
	if (!done) {
		throw { code: 'SERVERFAILURE', message: 'Server Failed to restart' }
	}
}

