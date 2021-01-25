'use strict'

export function MessagesViewModel (socket, changeScheduler) {
  const nonBreakingSpace = '\xa0'
  const emptyMessages = Array(2).fill(nonBreakingSpace)
  let messages = [...emptyMessages]

  socket
    .on('message', message => pushMessage(message))
    .on('throw', message => pushError(message))

  Object.defineProperties(this, {
    messages: {
      get: () => messages
    }
  })

  function pushMessage (message) {
    messages.unshift(message)
    messages.splice(emptyMessages.length)
    changeScheduler.schedule()
  }

  function pushError (error) {
    pushMessage(`Error: ${error}`)
  }

  this.clearMessages = () => {
    messages = [...emptyMessages]
    changeScheduler.schedule()
  }

  this.noMessages = () => messages.every(message => message === nonBreakingSpace)

  this.setCurrent = () => {}
}
