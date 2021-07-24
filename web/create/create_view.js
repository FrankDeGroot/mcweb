import { CreateViewModel } from './create_view_model.js'

export class CreateView {
  static hash = '#!/create'
  static name = 'Create World'
  static ViewModel = CreateViewModel
  #viewModel
  constructor(viewModel) {
    this.#viewModel = viewModel
  }
  render() {
    const {
      versionSelectDisabled,
      versions,
      nameInputDisabled,
      seedInputDisabled,
      createButtonDisabled
    } = this.#viewModel
    return uhtml.html`<select ?disabled=${versionSelectDisabled} onchange=${e => this.#viewModel.selectVersion(e.target.value)} size=${versions.length}>
      ${versions.map(({ label, selected, value }) => uhtml.html`<option ?selected=${selected} value=${value}>${label}</option>`)}
    </select>
    <input ?disabled=${nameInputDisabled} onkeyup=${e => { this.#viewModel.newWorldName = e.target.value }} type=text placeholder=Name>
    <input ?disabled=${seedInputDisabled} onkeyup=${e => { this.#viewModel.seed = e.target.value }} type=text placeholder=Seed>
    <button ?disabled=${createButtonDisabled} onclick=${() => this.#viewModel.createWorld()}>Create</button>`
  }
}
