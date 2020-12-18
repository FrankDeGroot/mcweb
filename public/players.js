'use strict'

import { select } from './select.js'

export function Players () {
  return {
    view: vnode => {
      return select(
        'Players',
        value => {
          vnode.attrs.viewModel.currentPlayer = value
        },
        vnode.attrs.viewModel.players,
        vnode.attrs.viewModel.currentPlayer,
        vnode.attrs.viewModel.busy
      )
    }
  }
}
