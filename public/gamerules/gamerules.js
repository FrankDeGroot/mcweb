'use strict'

import { Checkbox } from '../checkbox.js'

export function Gamerules () {
  return {
    view: ({ attrs: { gamerulesViewModel } }) =>
      gamerulesViewModel.gamerules.map(({ checked, disabled, gamerule, indeterminate, label, type, value }) => {
        switch (type) {
          case 'boolean': return m(Checkbox, {
            checked,
            disabled,
            id: gamerule,
            indeterminate,
            label,
            onchange: value => gamerulesViewModel.setGamerule(gamerule, value)
          })
          case 'integer': return m('combo', [
            m('input', {
              id: gamerule,
              disabled,
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
