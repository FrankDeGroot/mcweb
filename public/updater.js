'use strict'

export function Updater () {
  return {
    view: vnode => m('.row', [
      m(polythene.Button, {
        label: 'Update',
        events: {
          onclick: e => vnode.attrs.viewModel.updateVersion(vnode.attrs.currentVersion)
        },
        disabled: vnode.attrs.viewModel.canUpdate ? undefined : 'disabled'
      })
    ])
  }
}
