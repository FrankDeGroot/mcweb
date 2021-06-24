export function Scheduler (handler) {
  let scheduled = false
  this.schedule = () => {
    if (!scheduled) {
      setTimeout(() => {
        scheduled = false
        handler()
      }, 0)
      scheduled = true
    }
  }
}
