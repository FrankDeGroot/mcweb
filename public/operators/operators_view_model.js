'use strict'

export function OperatorsViewModel (handlers, changeScheduler) {
  let operators = []
  let selectedOperator = null
  Object.defineProperties(this, {
    operators: {
      get: () => operators.map(operator => {
        return {
          label: operator.name,
          selected: operator.uuid === selectedOperator.uuid,
          value: operator.uuid
        }
      })
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
    }
  })
  this.select = value => {
    selectedOperator = findOperator(value)
    changeScheduler.schedule()
  }
  this.setCurrent = response => {
    operators = response.operators
    if (!selectedOperator ||
        !findOperator(selectedOperator.uuid)) {
      selectedOperator = operators[0]
    }
    changeScheduler.schedule()
  }
  function findOperator (value) {
    return operators.find(({ uuid }) => uuid === value)
  }
}
