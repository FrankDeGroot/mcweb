import { spawn } from 'child_process'
import { state } from './state.js'

const { error, log } = console

let childProcess

state.update({
	server: 'stopped'
})

export function start() {
	if (childProcess) {
		error('Already started')
	}
	childProcess = spawn('java', ['-jar', 'server.jar'], {
		cwd: 'mc/fake',
		stdio: ['pipe', 'pipe', 'inherit']
	})
	childProcess.on('close', (code, signal) => {
		if (code || code === 0) {
			log('Stopped with code', code)
		}
		if (signal) {
			log('Stopped with signal', signal)
		}
		state.update({
			server: 'stopped'
		})
		childProcess = null
		process.off('SIGTERM', stop)
	})
	childProcess.stdout.pipe(process.stdout)
	childProcess.stdout.on('data', data => {
		if (data.toString().match(/: Done/)) {
			state.update({
				server: 'started'
			})
		}
	})
	state.update({
		server: 'starting'
	})
	process.on('SIGTERM', stop)
}

export function stop() {
	if(!childProcess) {
		error('Already stopped')
	}
	state.update({
		server: 'stopping'
	})
	childProcess.stdin.write('stop\n')
}
