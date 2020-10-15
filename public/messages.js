'use strict'

export function Messages () {
  return {
    view: vnode => m('div', [
      m(polythene.List, {
        header: { title: 'Messages' },
        tiles: vnode.attrs.viewModel.messages.map(title => m(polythene.ListTile, {
          title
        })),
        rounded: true,
        compact: true,
        insetH: true
      }),
      m('.row',
        m(polythene.Button, {
          label: 'Clear',
          events: {
            onclick: e => vnode.attrs.viewModel.clearMessages()
          },
          disabled: vnode.attrs.viewModel.busy ? 'disabled' : undefined
        })
      )
    ])
  }
}
