import * as events from '../events.js'

export function setupStateHandling(socket, viewModels) {
	let state = {}
	socket.on(events.state, changed => {
		state = { ...state, ...changed }
		viewModels.forEach(viewModel => {
			viewModel.state = state
		})
	})
}
