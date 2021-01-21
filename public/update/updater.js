'use strict'

export function Updater () {
  return {
    view: ({ attrs: { updateViewModel } }) => [
      m('button', {
        disabled: updateViewModel.updateReleaseButtonDisabled,
        onclick: e => updateViewModel.updateVersion('release')
      }, 'Update Release'),
      m('button', {
        disabled: updateViewModel.updateSnapshotButtonDisabled,
        onclick: e => updateViewModel.updateVersion('snapshot')
      }, 'Update Snapshot')
    ]
  }
}
