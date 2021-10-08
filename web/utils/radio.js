export function radio({ checked, disabled, label, name, onchange, options }) {
	return uhtml.html`<label>${label}</label>
    ${options.map(({ id, label }) => uhtml.html`<combo>
      <input id=${id} ?checked=${checked} ?disabled=${disabled} name=${name} onchange=${e => onchange(e.target.id)} type=radio>
      <label for=${id}>${label}</label>
    </combo>`)}`
}
