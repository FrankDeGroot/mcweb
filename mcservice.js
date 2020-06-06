const { spawn } = require('child_process')

const { log } = require('./log')

exports.start = async () => {
	mcctl('start')
}

exports.stop = async() => {
	mcctl('stop')
}

function mcctl(action) {
	return new Promise((resolve, reject) => {
		const systemctl = spawn('systemctl', [ '--user', action, 'mc' ])
			.on('close', code => {
			  log(`systemctl ${action} exited with code ${code}`)
				code ? reject(code) : resolve(code)
			})
			.on('error', err => console.error(`error: ${action} ${err}`))
		
		systemctl.stdout.on('data', data => {
			log(`stdout: ${action} ${data}`)
		})
		
		systemctl.stderr.on('data', data => {
			console.error(`stderr: ${action} ${data}`)
		})
	})
}

