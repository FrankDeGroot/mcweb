'use strict'

import { select } from './select.js'

export function Versions () {
  return {
    view: vnode => select(
      'Versions',
      value => {
        vnode.attrs.viewModel.currentVersion = value
      },
      vnode.attrs.viewModel.versions,
      vnode.attrs.viewModel.currentVersion,
      vnode.attrs.viewModel.busy
    )
  }
}
