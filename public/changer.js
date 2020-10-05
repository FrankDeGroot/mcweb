'use strict'

export function Changer () {
  return {
    view: vnode => m('.row', m(polythene.Button, {
      label: 'Change',
      events: {
        onclick: e => vnode.attrs.onChangeVerionAndWorld()
      },
      disabled: vnode.attrs.model.busy ? 'disabled' : undefined
    }))
  }
}
