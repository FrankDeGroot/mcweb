import { Server } from 'socket.io'

const { log } = console

const server = new Server(1024)
	.on('connection', socket => {
		socket.emit('pong')
	})

process.stdin.on('data', data => {
	if (data.toString() === 'r\n') {
		log('Reloading browser')
		server.emit('reload')
	}
})

log('API Started')
