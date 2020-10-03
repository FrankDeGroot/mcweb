'use strict'

export function Messages () {
  return {
    view: vnode => m(polythene.List, {
      header: { title: 'Messages' },
      tiles: vnode.attrs.model.messages.map(title => m(polythene.ListTile, {
        title
      })),
      rounded: true,
      compact: true,
      insetH: true
    })
  }
}
