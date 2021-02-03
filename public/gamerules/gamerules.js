'use strict'

import { Checkbox } from '../checkbox.js'

export function Gamerules () {
  return {
    view: ({ attrs: { gamerulesViewModel } }) =>
      gamerulesViewModel.gamerules.map(({ gamerule, label, type, value }) => {
        switch (type) {
          case 'boolean': return m(Checkbox, {
            checked: value,
            id: gamerule,
            label,
            onchange: value => gamerulesViewModel.setGamerule(gamerule, value)
          })
          case 'integer': return m('combo', [
            m('input', {
              id: gamerule,
              onchange: ({ target: { value } }) => gamerulesViewModel.setGamerule(gamerule, value),
              type: 'number',
              value
            }),
            m('label', {
              for: gamerule
            }, label)
          ])
          default: return m('div', `Unknown gamerule type '${type}'.`)
        }
      })
  }
}
