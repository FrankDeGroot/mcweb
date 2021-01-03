'use strict'

import { Scheduler } from '../scheduler.js'

export function OpsViewModel (handlers) {
  let ops = []
  const changeScheduler = new Scheduler(handlers.onChange)
  Object.defineProperties(this, {
    ops: {
      get: () => ops
    }
  })
  this.setCurrent = response => {
    ops = response.ops.map(ops => ops.name)
    changeScheduler.schedule()
  }
}
