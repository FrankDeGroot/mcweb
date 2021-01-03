'use strict'

export function Checkbox () {
  return {
    view: ({ attrs: { checked, id, label, onchange } }) => m('combo', [
      m('input', {
        checked,
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
