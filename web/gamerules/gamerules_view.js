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
    return _`${this.#viewModel.gamerules.map(({ checked, disabled, gamerule, indeterminate, label, type, value }) => {
      switch (type) {
        case 'boolean': return checkbox({
          checked,
          disabled,
          id: gamerule,
          indeterminate,
          label,
          onchange: value => this.#viewModel.setGamerule(gamerule, value)
        })
        case 'integer': return _`<combo>
              <input id=${gamerule} ?disabled=${disabled} onchange=${e => this.#viewModel.setGamerule(gamerule, e.target.value)} type=number value=${value}>
              <label for=${gamerule}>${label}</label>
            </combo>`
        default: return _`<div>Unknown gamerule type '${type}'.</div>`
      }
    })}`
  }
}