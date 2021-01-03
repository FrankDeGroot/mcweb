'use strict'

export function Creator () {
  return {
    view: vnode => [
      m('select', {
        disabled: vnode.attrs.busyViewModel.busy,
        onchange: e => vnode.attrs.createViewModel.selectVersion(e.target.value)
      }, vnode.attrs.createViewModel.versions.map(version => m('option', {
        selected: version.selected,
        value: version.value
      }, version.label))),
      m('input', {
        disabled: vnode.attrs.busyViewModel.busy,
        onchange: e => {
          vnode.attrs.createViewModel.newWorldName = e.target.value
        },
        type: 'text',
        placeholder: 'Name'
      }),
      m('input', {
        disabled: vnode.attrs.busyViewModel.busy,
        onchange: e => {
          vnode.attrs.createViewModel.seed = e.target.value
        },
        type: 'text',
        placeholder: 'Seed'
      }),
      m('button', {
        disabled: vnode.attrs.busyViewModel.busy,
        onclick: e => vnode.attrs.createViewModel.createWorld()
      }, 'Create')
    ]
  }
}
