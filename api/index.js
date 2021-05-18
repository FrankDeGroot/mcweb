import { Server } from 'socket.io'
import { start, stop } from './mc.js'
import { state } from './state.js'

const { log } = console

const server = new Server(1024)
	.on('connection', socket => {
		socket
			.on('start', () => start())
			.on('stop', () => stop())
			.emit('state', state.current)
	})

state.on('update', delta => server.emit('state', delta))

process.stdin.on('data', data => {
	if (data.toString() === 'r\n') {
		log('Reloading browser')
		server.emit('reload')
	}
})

log('API Started')
