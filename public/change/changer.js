'use strict'

export function Changer () {
  return {
    view: vnode => [
      m('select', {
        disabled: vnode.attrs.busyViewModel.busy,
        onchange: e => vnode.attrs.changeViewModel.selectVersionAndWorld(e.target.value)
      }, vnode.attrs.changeViewModel.versions.map(group => m('optgroup', {
        label: group.label
      }, group.options.map(option => m('option', {
        selected: option.selected,
        value: option.value
      }, option.label))))),
      m('button', {
        disabled: vnode.attrs.busyViewModel.busy,
        onclick: e => vnode.attrs.changeViewModel.changeVersionAndWorld()
      }, 'Change')
    ]
  }
}
