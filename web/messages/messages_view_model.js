import * as events from '../events.js'

const nonBreakingSpace = '\xa0'
const emptyMessages = Array(10).fill(nonBreakingSpace)

export class MessagesViewModel {
	#changeScheduler
	#messages = [...emptyMessages]
	constructor(socket, changeScheduler) {
		this.#changeScheduler = changeScheduler
		socket
			.on(events.receiveMinecraft, message => this.#pushMessage(message))
			.on(events.messageNotification, message => this.#pushMessage(message))
			.on(events.errorNotification, message => this.#pushError(message))
	}
	get messages() {
		return this.#messages
	}
	#pushMessage(message) {
		this.#messages.unshift(message)
		this.#messages.splice(emptyMessages.length)
		this.#changeScheduler.schedule()
	}
	#pushError(error) {
		this.#pushMessage(`Error: ${error}`)
	}
	clearMessages() {
		this.#messages = [...emptyMessages]
		this.#changeScheduler.schedule()
	}
	noMessages() {
		return this.#messages.every(message => message === nonBreakingSpace)
	}
	set state(state) {
	}
}
