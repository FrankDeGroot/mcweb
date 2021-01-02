'use strict'

export function Updater () {
  return {
    view: vnode => [
      m('button', {
        disabled: vnode.attrs.viewModel.busy,
        onclick: e => vnode.attrs.viewModel.updateVersion('release')
      }, 'Update Release'),
      m('button', {
        disabled: vnode.attrs.viewModel.busy,
        onclick: e => vnode.attrs.viewModel.updateVersion('snapshot')
      }, 'Update Snapshot')
    ]
  }
}
