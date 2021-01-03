'use strict'

export function Ops () {
  return {
    view: vnode => [
      m('select', {
        disabled: vnode.attrs.busyViewModel.busy
      }, vnode.attrs.opsViewModel.ops.map(ops => m('option', ops)))
    ]
  }
}
