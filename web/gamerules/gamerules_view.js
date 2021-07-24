import { GamerulesViewModel } from './gamerules_view_model.js'
import { checkbox } from '../utils/checkbox.js'

export class GamerulesView {
  static hash = '#!/gamerules'
  static name = 'Gamerules'
  static ViewModel = GamerulesViewModel
  #viewModel
  constructor(viewModel) {
    this.#viewModel = viewModel
  }
  render() {
    return uhtml.html`${this.#viewModel.gamerules.map(({ checked, disabled, gamerule, indeterminate, label, type, value }) => {
      switch (type) {
        case 'boolean': return checkbox({
          checked,
          disabled,
          id: gamerule,
          indeterminate,
          label,
          onchange: value => this.#viewModel.setGamerule(gamerule, value)
        })
        case 'integer': return uhtml.html`<combo>
              <input id=${gamerule} ?disabled=${disabled} onchange=${e => this.#viewModel.setGamerule(gamerule, e.target.value)} type=number value=${value}>
              <label for=${gamerule}>${label}</label>
            </combo>`
        default: return uhtml.html`<div>Unknown gamerule type '${type}'.</div>`
      }
    })}`
  }
}