import { UpdateViewModel } from './update_view_model.js'

export class UpdateView {
	static hash = '#!/update'
	static name = 'Update Server'
	static ViewModel = UpdateViewModel
	#viewModel
	constructor(viewModel) {
		this.#viewModel = viewModel
	}
	render() {
		const {
			updateReleaseButtonDisabled,
			updateSnapshotButtonDisabled,
			startMinecraftButtonDisabled,
			stopMinecraftButtonDisabled,
			sendMinecraftButtonDisabled,
		} = this.#viewModel
		return uhtml.html`<button ?disabled=${updateReleaseButtonDisabled} onclick=${() => this.#viewModel.updateVersion('release')}>Update Release</button>
    <button ?disabled=${updateSnapshotButtonDisabled} onclick=${() => this.#viewModel.updateVersion('snapshot')}>Update Snapshot</button>
		<button ?disabled=${startMinecraftButtonDisabled} onclick=${() => this.#viewModel.startMinecraft()}>Start Server</button >
		<button ?disabled=${stopMinecraftButtonDisabled} onclick=${() => this.#viewModel.stopMinecraft()}>Stop Server</button>
		<button ?disabled=${sendMinecraftButtonDisabled} onclick=${() => this.#viewModel.sendMinecraft()}>Send Server</button>`
	}
}
