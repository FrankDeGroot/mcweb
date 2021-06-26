import { checkbox } from '../utils/checkbox.js'
import { radio } from '../utils/radio.js'

export function operatorsView(operatorsViewModel) {
  return _`<select ?disabled=${operatorsViewModel.operatorSelectDisabled} onchange=${e => operatorsViewModel.select(e.target.value)} size=${operatorsViewModel.operatorsSize}>
    ${operatorsViewModel.operators.map(({ label, selected, value }) => _`<option ?selected=${selected} value=${value}>${label}</option>`)}
  </select>
  ${checkbox({
    checked: operatorsViewModel.bypassesPlayerLimit,
    disabled: operatorsViewModel.bypassesPlayerLimitCheckboxDisabled,
    id: 'bypassesPlayerLimit',
    label: 'Bypasses Player Limit',
    onchange: value => {
      operatorsViewModel.bypassesPlayerLimit = value
    }
  })}
  ${radio({
    checked: operatorsViewModel.level,
    disabled: operatorsViewModel.levelRadioDisabled,
    label: 'Ops Level',
    name: 'level',
    onchange: value => {
      operatorsViewModel.level = value
    },
    options: [{
      id: '0',
      label: 'None'
    }, {
      id: '1',
      label: 'Spawn Protection'
    }, {
      id: '2',
      label: 'Single Player Cheats'
    }, {
      id: '3',
      label: 'Multiplayer Management'
    }, {
      id: '4',
      label: 'Server Management'
    }]
  })}`
}
