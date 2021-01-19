'use strict'

const { info, log } = require('../utils/log')
const { doIfNotBusy } = require('../utils/busy')

exports.setup = async (socket, server, current, actions) => {
  function notify (message) {
    info(message)
    server.emit('message', message)
  }

  async function emitCurrent (emitter) {
    try {
      emitter.emit('current', await current())
    } catch (error) {
      log(error.code ? 'error' : 'info', error)
      server.emit('throw', error.code ? 'An internal error occurred' : error.message)
    }
  }

  Object.entries(actions).forEach(([name, action]) => {
    socket.on(name, async (...args) => {
      await doIfNotBusy(async () => {
        await emitCurrent(server)
        await action(...args, notify)
      })
      emitCurrent(server)
    })
  })

  await emitCurrent(socket)
}
