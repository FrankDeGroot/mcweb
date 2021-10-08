import { Scheduler } from './scheduler.js'
import { setupStateHandling } from './state_handler.js'

export class ViewModelFactory {
	#viewModels = []
	#changeScheduler
	#socket
	constructor(socket, redraw) {
		this.#changeScheduler = new Scheduler(redraw)
		this.#socket = socket
		setupStateHandling(this.#socket, this.#viewModels)
	}
	createViewModel(ViewModel) {
		const viewModel = new ViewModel(this.#socket, this.#changeScheduler)
		this.#viewModels.push(viewModel)
		return viewModel
	}
}
