'use strict'

import { Checkbox } from '../checkbox.js'

export function Gamerules () {
  return {
    view: ({ attrs: { gamerulesViewModel } }) => [
      m(Checkbox, {
        checked: gamerulesViewModel.keepInventory,
        id: 'keepInventory',
        label: 'Keep Inventory',
        onchange: value => {
          gamerulesViewModel.keepInventory = value
        }
      })
    ]
  }
}
