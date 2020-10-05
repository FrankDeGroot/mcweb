'use strict'

export function Updater () {
  return {
    view: vnode => m('.row', [
      m(polythene.Button, {
        label: 'Update',
        events: {
          onclick: e => vnode.attrs.onUpdateVersion(vnode.attrs.model.version)
        },
        disabled: vnode.attrs.model.busy || !vnode.attrs.model.canUpdate ? 'disabled' : undefined
      })
    ])
  }
}
