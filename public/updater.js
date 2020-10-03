'use strict'

export function Updater () {
  return {
    view: vnode => m('.row', [
      m(polythene.Button, {
        label: 'Update Release',
        events: {
          onclick: e => vnode.attrs.onupdateversion('release')
        },
        disabled: vnode.attrs.model.busy ? 'disabled' : undefined
      }),
      m(polythene.Button, {
        label: 'Update Snapshot',
        events: {
          onclick: e => vnode.attrs.onupdateversion('snapshot')
        },
        disabled: vnode.attrs.model.busy ? 'disabled' : undefined
      })
    ])
  }
}
