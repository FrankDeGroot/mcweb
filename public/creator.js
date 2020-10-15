'use strict'

export function Creator () {
  return {
    view: vnode => m('.row', [
      m(polythene.TextField, {
        help: 'Name for created world',
        label: 'Name',
        onChange: newState => {
          vnode.attrs.viewModel.newWorldName = newState.value
        }
      }),
      m(polythene.TextField, {
        help: 'Seed for created world',
        label: 'Seed',
        onChange: newState => {
          vnode.attrs.viewModel.seed = newState.value
        }
      }),
      m(polythene.Button, {
        label: 'Create',
        events: {
          onclick: e => vnode.attrs.viewModel.createWorld()
        },
        disabled: vnode.attrs.viewModel.busy ? 'disabled' : undefined
      })
    ])
  }
}
