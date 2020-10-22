'use strict'

export function ChangeScheduler (onChange) {
  let changeScheduled = false
  this.scheduleChange = () => {
    if (!changeScheduled) {
      setTimeout(() => {
        changeScheduled = false
        onChange()
      }, 0)
      changeScheduled = true
    }
  }
}
