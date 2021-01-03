'use strict'

export function Updater () {
  return {
    view: vnode => [
      m('button', {
        disabled: vnode.attrs.busyViewModel.busy,
        onclick: e => vnode.attrs.updateViewModel.updateVersion('release')
      }, 'Update Release'),
      m('button', {
        disabled: vnode.attrs.busyViewModel.busy,
        onclick: e => vnode.attrs.updateViewModel.updateVersion('snapshot')
      }, 'Update Snapshot')
    ]
  }
}
