'use strict'

import { Checkbox } from '../checkbox.js'

export function Gamerules () {
  return {
    view: ({ attrs: { gamerulesViewModel } }) =>
      Object.entries(gamerulesViewModel.gamerules)
        .map(([gamerule, { type, value }]) => {
          switch (type) {
            case 'boolean': return m(Checkbox, {
              checked: value,
              id: gamerule,
              label: gamerule,
              onchange: value => gamerulesViewModel.setGamerule(gamerule, value)
            })
            case 'integer': return m('combo', [
              m('input', {
                id: gamerule,
                onchange: ({ target: { value } }) => gamerulesViewModel.setGamerule(gamerule, value),
                type: 'number',
                value
              })
            ])
          }
        })
  }
}
