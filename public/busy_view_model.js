'use strict'

export function BusyViewModel (changeScheduler) {
  let busy = false

  Object.defineProperties(this, {
    busy: {
      get: () => busy
    }
  })

  this.setCurrent = (current) => {
    if (busy !== current.busy) {
      busy = current.busy
      changeScheduler.schedule()
    }
  }
}
