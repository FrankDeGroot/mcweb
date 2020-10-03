'use strict'

export function Creator () {
  return {
    view: vnode => m('.row', [
      m(polythene.TextField, {
        help: 'Seed for created world',
        label: 'Seed',
        onChange: newState => {
          vnode.attrs.model.seed = newState.value
        }
      }),
      m(polythene.Button, {
        label: 'Create',
        events: {
          onclick: e => vnode.attrs.oncreateworld(vnode.attrs.model.seed)
        },
        disabled: vnode.attrs.model.busy ? 'disabled' : undefined
      })
    ])
  }
}
