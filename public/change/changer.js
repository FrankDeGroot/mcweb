'use strict'

export function Changer () {
  return {
    view: ({ attrs: { changeViewModel } }) => [
      m('select', {
        disabled: changeViewModel.versionAndWorldSelectDisabled,
        onchange: e => changeViewModel.selectVersionAndWorld(e.target.value),
        size: changeViewModel.versionAndWorldSelectSize
      }, changeViewModel.versions.map(group => m('optgroup', {
        label: group.label
      }, group.options.map(({ label, selected, value }) => m('option', {
        selected,
        value
      }, label))))),
      m('button', {
        disabled: changeViewModel.changeButtonDisabled,
        onclick: e => changeViewModel.changeVersionAndWorld()
      }, 'Change')
    ]
  }
}
