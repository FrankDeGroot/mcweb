'use strict'

export function Radio () {
  return {
    view: ({ attrs: { checked, disabled, label, name, onchange, options } }) => [
      m('label', label),
      options.map(({ id, label }) => [
        m('combo', [
          m('input', {
            id,
            checked: id === checked,
            disabled,
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
