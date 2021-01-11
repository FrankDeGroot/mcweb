'use strict'

export function BusyViewModel (handlers, changeScheduler) {
  let busy = false

  handlers = {
    onReady: () => {},
    ...handlers
  }

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
