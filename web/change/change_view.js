import { ChangeViewModel } from './change_view_model.js'

export class ChangeView {
  static hash = '#!/change'
  static name = 'Change World'
  static ViewModel = ChangeViewModel
  #viewModel
  constructor(viewModel) {
    this.#viewModel = viewModel
  }
  render() {
    const {
      versionAndWorldSelectDisabled,
      versionAndWorldSelectSize,
      versions,
      changeButtonDisabled
    } = this.#viewModel
    return _`<select ?disabled=${versionAndWorldSelectDisabled} onchange=${e => this.#viewModel.selectVersionAndWorld(e.target.value)} size=${versionAndWorldSelectSize}>
      ${versions.map(group => _`<optgroup label=${group.label}>
        ${group.options.map(({ label, selected, value }) => _`<option ?selected=${selected} value=${value}>${label}</option>`)}
      </optgroup>`)}
    </select>
    <button ?disabled=${changeButtonDisabled} onclick=${() => this.#viewModel.changeVersionAndWorld()}>Change</button>`
  }
}