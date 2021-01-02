'use strict'

export function Creator () {
  return {
    view: vnode => [
      m('select', {
        onchange: e => vnode.attrs.viewModel.selectVersion(e.target.value)
      }, vnode.attrs.viewModel.versions.map(group => m('option', {
        disabled: vnode.attrs.viewModel.busy,
        selected: group.selected
      }, group.label))),
      m('input', {
        disabled: vnode.attrs.viewModel.busy,
        onchange: e => {
          vnode.attrs.viewModel.newWorldName = e.target.value
        },
        type: 'text',
        placeholder: 'Name'
      }),
      m('input', {
        disabled: vnode.attrs.viewModel.busy,
        onchange: e => {
          vnode.attrs.viewModel.seed = e.target.value
        },
        type: 'text',
        placeholder: 'Seed'
      }),
      m('button', {
        disabled: vnode.attrs.viewModel.busy,
        onclick: e => vnode.attrs.viewModel.createWorld()
      }, 'Create')
    ]
  }
}
