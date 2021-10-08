import { MessagesViewModel } from './messages_view_model.js'

export class MessagesView {
	static ViewModel = MessagesViewModel
	#viewModel
	constructor(viewModel) {
		this.#viewModel = viewModel
	}
	render() {
		return uhtml.html`<label>Messages</label>
    <messages>${this.#viewModel.messages.map(message => uhtml.html`<message>${message}</message>`)}</messages>
    <button ?disabled=${this.#viewModel.noMessages()} onclick=${() => this.#viewModel.clearMessages()}>Clear</button>`
	}
}
