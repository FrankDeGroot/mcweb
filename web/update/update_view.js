export function updateView (updateViewModel) {
  return _`<button ?disabled=${updateViewModel.updateReleaseButtonDisabled} onclick=${() => updateViewModel.updateVersion('release')}>Update Release</button>
  <button ?disabled=${updateViewModel.updateSnapshotButtonDisabled} onclick=${() => updateViewModel.updateVersion('snapshot')}>Update Snapshot</button>`
}
