'use strict'

export function Radio () {
  return {
    view: ({ attrs: { checked, label, name, onchange, options } }) => [
      m('label', label),
      options.map(({ id, label }) => [
        m('combo', [
          m('input', {
            id,
            checked: id === checked,
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
