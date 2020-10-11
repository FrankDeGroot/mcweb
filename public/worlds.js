'use strict'

import { select } from './select.js'

export function Worlds () {
  return {
    view: vnode => select(
      'Worlds',
      value => vnode.attrs.onChangeWorld(value),
      vnode.attrs.model.worlds,
      vnode.attrs.model.world,
      vnode.attrs.model.busy
    )
  }
}
