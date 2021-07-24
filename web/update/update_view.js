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
      updateSnapshotButtonDisabled
    } = this.#viewModel
    return uhtml.html`<button ?disabled=${updateReleaseButtonDisabled} onclick=${() => this.#viewModel.updateVersion('release')}>Update Release</button>
    <button ?disabled=${updateSnapshotButtonDisabled} onclick=${() => this.#viewModel.updateVersion('snapshot')}>Update Snapshot</button>`
  }
}