'use strict'

export function Changer () {
  return {
    view: ({ attrs: { changeViewModel } }) => [
      m('select', {
        disabled: changeViewModel.versionAndWorldSelectDisabled,
        onchange: e => changeViewModel.selectVersionAndWorld(e.target.value)
      }, changeViewModel.versions.map(group => m('optgroup', {
        label: group.label
      }, group.options.map(option => m('option', {
        selected: option.selected,
        value: option.value
      }, option.label))))),
      m('button', {
        disabled: changeViewModel.changeButtonDisabled,
        onclick: e => changeViewModel.changeVersionAndWorld()
      }, 'Change')
    ]
  }
}
