import { OperatorsViewModel } from './operators_view_model.js'
import { checkbox } from '../utils/checkbox.js'
import { radio } from '../utils/radio.js'

export class OperatorsView {
	static hash = '#!/operators'
	static name = 'Operators'
	static ViewModel = OperatorsViewModel
	#viewModel
	constructor(viewModel) {
		this.#viewModel = viewModel
	}
	render() {
		const {
			operatorSelectDisabled,
			operatorsSize,
			operators,
			bypassesPlayerLimit,
			bypassesPlayerLimitCheckboxDisabled,
			level,
			levelRadioDisabled
		} = this.#viewModel
		return uhtml.html`<select ?disabled=${operatorSelectDisabled} onchange=${e => this.#viewModel.select(e.target.value)} size=${operatorsSize}>
      ${operators.map(({ label, selected, value }) => uhtml.html`<option ?selected=${selected} value=${value}>${label}</option>`)}
    </select>
    ${checkbox({
			checked: bypassesPlayerLimit,
			disabled: bypassesPlayerLimitCheckboxDisabled,
			id: 'bypassesPlayerLimit',
			label: 'Bypasses Player Limit',
			onchange: value => {
				this.#viewModel.bypassesPlayerLimit = value
			}
		})}
    ${radio({
			checked: level,
			disabled: levelRadioDisabled,
			label: 'Ops Level',
			name: 'level',
			onchange: value => {
				this.#viewModel.level = value
			},
			options: [{
				id: '0',
				label: 'None'
			}, {
				id: '1',
				label: 'Spawn Protection'
			}, {
				id: '2',
				label: 'Single Player Cheats'
			}, {
				id: '3',
				label: 'Multiplayer Management'
			}, {
				id: '4',
				label: 'Server Management'
			}]
		})}`
	}
}
