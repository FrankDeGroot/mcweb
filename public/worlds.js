'use strict'

import { select } from './select.js'

export function Worlds () {
  return {
    view: vnode => select(
      'Worlds',
      value => {
        vnode.attrs.viewModel.currentWorld = value
      },
      vnode.attrs.viewModel.worlds,
      vnode.attrs.viewModel.currentWorld,
      vnode.attrs.viewModel.busy
    )
  }
}
