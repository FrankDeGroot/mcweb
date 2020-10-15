'use strict'

export function Changer () {
  return {
    view: vnode => m('.row', m(polythene.Button, {
      label: 'Change',
      events: {
        onclick: e => vnode.attrs.viewModel.changeVersionAndWorld()
      },
      disabled: vnode.attrs.viewModel.busy ? 'disabled' : undefined
    }))
  }
}
