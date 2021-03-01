'use strict'

export function Checkbox () {
  return {
    view: ({ attrs: { checked, disabled, id, indeterminate, label, onchange } }) => m('combo', [
      m('input', {
        checked,
        disabled,
        id,
        indeterminate,
        onchange: e => onchange(e.target.checked),
        type: 'checkbox'
      }),
      m('label', {
        for: id
      }, label)
    ])
  }
}
