'use strict'

import { Scheduler } from '../scheduler.js'

export function MessagesViewModel (handlers) {
  const nonBreakingSpace = '\xa0'
  const emptyMessages = Array(2).fill(nonBreakingSpace)
  let messages = [...emptyMessages]
  const changeScheduler = new Scheduler(handlers.onChange)

  Object.defineProperties(this, {
    messages: {
      get: () => messages
    }
  })

  this.pushMessage = message => {
    messages.unshift(message)
    messages.splice(emptyMessages.length)
    changeScheduler.schedule()
  }

  this.pushError = error => {
    this.pushMessage(`Error: ${error}`)
  }

  this.clearMessages = () => {
    messages = [...emptyMessages]
    changeScheduler.schedule()
  }

  this.noMessages = () => messages.every(message => message === nonBreakingSpace)
}
