export function changer (changeViewModel) {
  return _`<select ?disabled=${changeViewModel.versionAndWorldSelectDisabled} onchange=${e => changeViewModel.selectVersionAndWorld(e.target.value)} size=${changeViewModel.versionAndWorldSelectSize}>
    ${changeViewModel.versions.map(group => _`<optgroup label=${group.label}>
      ${group.options.map(({ label, selected, value }) => _`<option ?selected=${selected} value=${value}>${label}</option>`)}
    </optgroup>`)}
  </select>
  <button ?disabled=${changeViewModel.changeButtonDisabled} onclick=${() => changeViewModel.changeVersionAndWorld()}>Change</button>`
}
