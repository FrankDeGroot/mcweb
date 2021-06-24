export function createView(createViewModel) {
  return _`<select ?disabled=${createViewModel.versionSelectDisabled} onchange=${e => createViewModel.selectVersion(e.target.value)} size=${createViewModel.versions.length}>
    ${createViewModel.versions.map(({ label, selected, value }) => _`<option ?selected=${selected} value=${value}>${label}</option>`)}
  </select>
  <input ?disabled=${createViewModel.nameInputDisabled} onkeyup=${e => { createViewModel.newWorldName = e.target.value }} type=text placeholder=Name>
  <input ?disabled=${createViewModel.seedInputDisabled} onkeyup=${e => { createViewModel.seed = e.target.value }} type=text placeholder=Seed>
  <button ?disabled=${createViewModel.createButtonDisabled} onclick=${() => createViewModel.createWorld()}>Create</button>`
}
