'use strict'

const { info, log } = require('../utils/log')
const { doIfNotBusy } = require('../utils/busy')
const { getCurrentState: getFullState, getChangedState } = require('./state')

exports.setup = async (socket, server, actions) => {
  function notify (message) {
    info(message)
    server.emit('message', message)
  }

  async function safeEmit (emitter, event, getState) {
    try {
      emitter.emit(event, await getState())
    } catch (error) {
      log(error.code ? 'error' : 'info', error)
      server.emit('throw', error.code ? 'An internal error occurred' : error.message)
    }
  }

  Object.entries(actions).forEach(([name, action]) => {
    socket.on(name, async (...args) => {
      await doIfNotBusy(async () => {
        await safeEmit(server, 'changed', () => getChangedState(true))
        await action(...args, notify)
        await safeEmit(server, 'changed', () => getChangedState(false))
      })
    })
  })

  await safeEmit(socket, 'current', getFullState)
}
