import { checkbox } from '../checkbox.js'

export function gamerulesView(gamerulesViewModel) {
  return _`${gamerulesViewModel.gamerules.map(({ checked, disabled, gamerule, indeterminate, label, type, value }) => {
    switch (type) {
      case 'boolean': return checkbox({
        checked,
        disabled,
        id: gamerule,
        indeterminate,
        label,
        onchange: value => gamerulesViewModel.setGamerule(gamerule, value)
      })
      case 'integer': return _`<combo>
            <input id=${gamerule} ?disabled=${disabled} onchange=${e => gamerulesViewModel.setGamerule(gamerule, e.target.value)} type=number value=${value}>
            <label for=${gamerule}>${label}</label>
          </combo>`
      default: return _`<div>Unknown gamerule type '${type}'.</div>`
    }
  })}`
}
