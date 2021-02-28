'use strict'

export function OperatorsViewModel (socket, changeScheduler) {
  let state = {
    operators: [],
    busy: false
  }
  let selectedOperator = null
  Object.defineProperties(this, {
    operators: {
      get: () => state.operators.map(operator => {
        return {
          label: operator.name,
          selected: operator.uuid === selectedOperator.uuid,
          value: operator.uuid
        }
      })
    },
    operatorsSize: {
      get: () => state.operators.length
    },
    bypassesPlayerLimit: {
      get: () => selectedOperator && selectedOperator.bypassesPlayerLimit,
      set: value => {
        if (selectedOperator && value !== selectedOperator.bypassesPlayerLimit) {
          selectedOperator.bypassesPlayerLimit = value
          changeScheduler.schedule()
        }
      }
    },
    level: {
      get: () => selectedOperator && selectedOperator.level.toString(),
      set: value => {
        if (selectedOperator && value !== selectedOperator.level) {
          selectedOperator.level = +value
          changeScheduler.schedule()
        }
      }
    },
    operatorSelectDisabled: {
      get: () => state.busy
    },
    bypassesPlayerLimitCheckboxDisabled: {
      get: () => state.busy
    },
    levelRadioDisabled: {
      get: () => state.busy
    }
  })
  this.select = value => {
    selectedOperator = findOperator(value)
    changeScheduler.schedule()
  }
  this.setCurrent = response => {
    state = response
    if (!selectedOperator ||
        !findOperator(selectedOperator.uuid)) {
      selectedOperator = state.operators[0]
    }
    changeScheduler.schedule()
  }
  function findOperator (value) {
    return state.operators.find(({ uuid }) => uuid === value)
  }
}
