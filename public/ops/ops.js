'use strict'

import { Checkbox } from '../checkbox.js'
import { Radio } from '../radio.js'

export function Ops () {
  return {
    view: ({ attrs: { busyViewModel, opsViewModel } }) => [
      m('select', {
        disabled: busyViewModel.busy,
        onchange: e => opsViewModel.select(e.target.value)
      }, opsViewModel.ops.map(({ label, selected, value }) => m('option', {
        value,
        selected
      }, label))),
      m(Checkbox, {
        checked: opsViewModel.bypassesPlayerLimit,
        disabled: false,
        id: 'bypassesPlayerLimit',
        label: 'Bypasses Player Limit',
        onchange: value => {
          opsViewModel.bypassesPlayerLimit = value
        }
      }),
      m(Radio, {
        checked: opsViewModel.level,
        label: 'Ops Level',
        name: 'level',
        onchange: value => {
          opsViewModel.level = value
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
