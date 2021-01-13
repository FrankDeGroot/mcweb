'use strict'

import { Checkbox } from '../checkbox.js'
import { Radio } from '../radio.js'

export function Operators () {
  return {
    view: ({ attrs: { busyViewModel, operatorsViewModel } }) => [
      m('select', {
        disabled: busyViewModel.busy,
        onchange: e => operatorsViewModel.select(e.target.value)
      }, operatorsViewModel.operators.map(({ label, selected, value }) => m('option', {
        value,
        selected
      }, label))),
      m(Checkbox, {
        checked: operatorsViewModel.bypassesPlayerLimit,
        disabled: false,
        id: 'bypassesPlayerLimit',
        label: 'Bypasses Player Limit',
        onchange: value => {
          operatorsViewModel.bypassesPlayerLimit = value
        }
      }),
      m(Radio, {
        checked: operatorsViewModel.level,
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
      })
    ]
  }
}
