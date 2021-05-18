import { spawn } from 'child_process'
import { state } from './state.js'

const { error, log } = console

export function start() {
	log('start')
	state.update({
		server: 'started'
	})
}

export function stop() {
	log('stop')
	state.update({
		server: 'stopped'
	})
}
