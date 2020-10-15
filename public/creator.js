'use strict'

export function Creator () {
  return {
    view: vnode => m('.row', [
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
          onclick: e => vnode.attrs.viewModel.onCreateWorld(vnode.attrs.seed)
        },
        disabled: vnode.attrs.viewModel.busy ? 'disabled' : undefined
      })
    ])
  }
}
