self._ = uhtml.html
let state = {}
const socket = io()
	.on('reload', () => location.reload())
	.on('state', delta => {
		state = { ...state, ...delta }
		const startButton = _`<button ?disabled=${state.server !== 'stopped'} onclick=${() => socket.emit('start')}>Start</button>`
		const stopButton = _`<button ?disabled=${state.server !== 'started'} onclick=${() => socket.emit('stop')}>Stop</button>`
		uhtml.render(document.body, _`${startButton}${stopButton}`)
	})
