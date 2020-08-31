'use strict'

const { spawn } = require('child_process')
const { error, info } = require('./log')

exports.start = async () => mcctl('start')

exports.stop = async() => mcctl('stop')

function mcctl(action) {
	return new Promise((resolve, reject) => {
		const systemctl = spawn('systemctl', [ '--user', action, 'mc' ])
			.on('close', code => {
			  info(`systemctl ${action} exited with code ${code}`)
				code ? reject(code) : resolve(code)
			})
			.on('error', err => {
				error(`error: ${action} ${err}`)
				reject(err)
			})
		
		systemctl.stdout.on('data', data => {
			info(`stdout: ${action} ${data}`)
		})
		
		systemctl.stderr.on('data', data => {
			error(`stderr: ${action} ${data}`)
		})
	})
}

