'use strict'

export function Checkbox () {
  return {
    view: ({ attrs: { checked, disabled, id, label, onchange } }) => m('combo', [
      m('input', {
        checked,
        disabled,
        id,
        onchange: e => onchange(e.target.checked),
        type: 'checkbox'
      }),
      m('label', {
        for: id
      }, label)
    ])
  }
}
