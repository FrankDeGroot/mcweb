'use strict'

import { Checkbox } from '../checkbox.js'
import { Radio } from '../radio.js'

export function Ops () {
  return {
    view: vnode => [
      m('select', {
        disabled: vnode.attrs.busyViewModel.busy
      }, vnode.attrs.opsViewModel.ops.map(ops => m('option', ops))),
      m(Checkbox, {
        id: 'bypassPlayerLimit',
        label: 'Bypass Player Limit',
        onchange: value => console.log(value)
      }),
      m(Radio, {
        label: 'Ops Level',
        name: 'level',
        onchange: value => console.log(value),
        options: [{
          id: 'levelNone',
          label: 'None'
        }, {
          id: 'levelSpawnProtection',
          label: 'Spawn Protection'
        }]
      })
    ]
  }
}
