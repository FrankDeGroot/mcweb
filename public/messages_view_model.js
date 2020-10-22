'use strict'

import { ChangeScheduler } from './change_scheduler.js'

export function MessagesViewModel (handlers) {
  // Non-breaking spaces!
  const emptyMessages = [' ', ' ']
  let messages = [...emptyMessages]
  const changeScheduler = new ChangeScheduler(handlers.onChange)

  Object.defineProperties(this, {
    messages: {
      get: () => messages
    }
  })

  this.pushMessage = message => {
    messages.unshift(message)
    messages.splice(emptyMessages.length)
    changeScheduler.scheduleChange()
  }

  this.pushError = error => {
    this.pushMessage(`Error: ${error}`)
  }

  this.clearMessages = () => {
    messages = [...emptyMessages]
    changeScheduler.scheduleChange()
  }
}
