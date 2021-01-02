'use strict'

export function Changer () {
  return {
    view: vnode => [
      m('select', {
        disabled: vnode.attrs.viewModel.busy,
        onchange: e => vnode.attrs.viewModel.selectVersionAndWorld(e.target.value)
      }, vnode.attrs.viewModel.versions.map(group => m('optgroup', {
        label: group.label
      }, group.options.map(option => m('option', {
        selected: option.selected,
        value: option.value
      }, option.label))))),
      m('button', {
        disabled: vnode.attrs.viewModel.busy,
        onclick: e => vnode.attrs.viewModel.changeVersionAndWorld()
      }, 'Change')
    ]
  }
}
