export class OperatorsViewModel {
	#state = {
		operators: [],
		busy: false
	}
	#selectedOperator = null
	#changeScheduler
	constructor(socket, changeScheduler) {
		this.#changeScheduler = changeScheduler
	}
	get operators() {
		return this.#state.operators.map(operator => {
			return {
				label: operator.name,
				selected: operator.uuid === this.#selectedOperator.uuid,
				value: operator.uuid
			}
		})
	}
	get operatorsSize() {
		return this.#state.operators.length
	}
	get bypassesPlayerLimit() {
		return this.#selectedOperator && this.#selectedOperator.bypassesPlayerLimit
	}
	set bypassesPlayerLimit(value) {
		if (this.#selectedOperator && value !== this.#selectedOperator.bypassesPlayerLimit) {
			this.#selectedOperator.bypassesPlayerLimit = value
			this.#changeScheduler.schedule()
		}
	}
	get level() {
		return this.#selectedOperator && this.#selectedOperator.level.toString()
	}
	set level(value) {
		if (this.#selectedOperator && value !== this.#selectedOperator.level) {
			this.#selectedOperator.level = +value
			this.#changeScheduler.schedule()
		}
	}
	get operatorSelectDisabled() {
		return this.#state.busy
	}
	get bypassesPlayerLimitCheckboxDisabled() {
		return this.#state.busy
	}
	get levelRadioDisabled() {
		return this.#state.busy
	}
	select(value) {
		this.#selectedOperator = this.#findOperator(value)
		this.#changeScheduler.schedule()
	}
	set state(state) {
		this.#state = state
		if (!this.#selectedOperator ||
			!this.#findOperator(this.#selectedOperator.uuid)) {
			this.#selectedOperator = this.#state.operators[0]
		}
		this.#changeScheduler.schedule()
	}
	#findOperator(value) {
		return this.#state.operators.find(({ uuid }) => uuid === value)
	}
}
