'use strict'

export function Creator () {
  return {
    view: ({ attrs: { createViewModel } }) => [
      m('select', {
        disabled: createViewModel.versionSelectDisabled,
        onchange: e => createViewModel.selectVersion(e.target.value)
      }, createViewModel.versions.map(version => m('option', {
        selected: version.selected,
        value: version.value
      }, version.label))),
      m('input', {
        disabled: createViewModel.nameInputDisabled,
        onkeyup: e => {
          createViewModel.newWorldName = e.target.value
        },
        type: 'text',
        placeholder: 'Name'
      }),
      m('input', {
        disabled: createViewModel.seedInputDisabled,
        onchange: e => {
          createViewModel.seed = e.target.value
        },
        type: 'text',
        placeholder: 'Seed'
      }),
      m('button', {
        disabled: createViewModel.createButtonDisabled,
        onclick: e => createViewModel.createWorld()
      }, 'Create')
    ]
  }
}
