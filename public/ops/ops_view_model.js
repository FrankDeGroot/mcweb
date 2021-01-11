'use strict'

export function OpsViewModel (handlers, changeScheduler) {
  let ops = []
  let selectedOperator = null
  Object.defineProperties(this, {
    ops: {
      get: () => ops.map(op => {
        return {
          label: op.name,
          selected: op.uuid === selectedOperator.uuid,
          value: op.uuid
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
    selectedOperator = ops.find(({ uuid }) => uuid === value)
    changeScheduler.schedule()
  }
  this.setCurrent = response => {
    ops = response.ops
    selectedOperator = ops[0]
    changeScheduler.schedule()
  }
}
