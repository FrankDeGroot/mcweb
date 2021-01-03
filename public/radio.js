'use strict'

export function Radio () {
  return {
    view: ({ attrs: { checked, label, name, onchange, options } }) => [
      m('label', label),
      options.map(({ id, label }) => [
        m('combo', [
          m('input', {
            id,
            checked: checked === id,
            name,
            onchange: e => onchange(e.target.id),
            type: 'radio'
          }),
          m('label', {
            for: id
          }, label)
        ])
      ])
    ]
  }
}
