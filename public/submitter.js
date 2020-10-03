'use strict'

export function Submitter () {
  return {
    view: vnode => m('.row', m(polythene.Button, {
      label: 'Change',
      events: {
        onclick: e => vnode.attrs.onsubmit()
      },
      disabled: vnode.attrs.model.busy ? 'disabled' : undefined
    }))
  }
}
