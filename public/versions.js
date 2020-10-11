'use strict'

import { select } from './select.js'

export function Versions () {
  return {
    view: vnode => select(
      'Versions',
      value => vnode.attrs.onChangeVersion(value),
      vnode.attrs.model.versions,
      vnode.attrs.model.version,
      vnode.attrs.model.busy
    )
  }
}
