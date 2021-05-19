self._ = uhtml.html
let state = {}
const socket = io()
	.on('reload', () => location.reload())
	.on('state', delta => {
		state = { ...state, ...delta }
		uhtml.render(document.body, _`${startButton()}${stopButton()}${state.server}`)
	})

function startButton() {
	return _`<button ?disabled=${state.server !== 'stopped'} onclick=${() => socket.emit('start')}>Start</button>`
}

function stopButton() {
	return _`<button ?disabled=${state.server !== 'started'} onclick=${() => socket.emit('stop')}>Stop</button>`
}
