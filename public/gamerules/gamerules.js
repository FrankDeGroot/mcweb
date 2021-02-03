'use strict'

import { Checkbox } from '../checkbox.js'

export function Gamerules () {
  return {
    view: ({ attrs: { gamerulesViewModel } }) =>
      Object.entries(gamerulesViewModel.gamerules)
        .sort(([g1, { label: label1, type: type1 }], [g2, { label: label2, type: type2 }]) => type1 < type2 ? -1 : type1 > type2 ? 1 : label1 < label2 ? -1 : label1 > label2 ? 1 : 0)
        .map(([gamerule, { label, type, value }]) => {
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
