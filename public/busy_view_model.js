'use strict'

import { Scheduler } from './scheduler.js'

export function BusyViewModel (handlers) {
  let busy = false

  handlers = {
    onChange: () => {},
    onReady: () => {},
    ...handlers
  }
  const changeScheduler = new Scheduler(handlers.onChange)

  Object.defineProperties(this, {
    busy: {
      get: () => busy,
      set: value => {
        if (busy !== value) {
          busy = value
          if (!busy) handlers.onReady()
          changeScheduler.schedule()
        }
      }
    }
  })
}
