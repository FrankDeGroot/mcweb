'use strict'

export function Players () {
  return {
    view: vnode => [
      m('select', {
        disabled: vnode.attrs.viewModel.busy
      }, vnode.attrs.viewModel.players.map(player => m('option', player)))
    ]
  }
}
