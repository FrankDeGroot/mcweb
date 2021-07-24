export function checkbox({ checked, disabled, id, indeterminate, label, onchange }) {
  return uhtml.html`<combo>
    <input ?checked=${checked} ?disabled=${disabled} id=${id} ?indeterminate=${indeterminate} onchange=${e => onchange(e.target.checked)} type=checkbox>
    <label for=${id}>${label}</label>
  </combo>`
}
