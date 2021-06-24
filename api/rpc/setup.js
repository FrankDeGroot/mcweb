'use strict'

const { doIfNotBusy } = require('../utils/busy')
const { Notifier } = require('./notifier')
const { getCurrentState: getFullState, getChangedState } = require('./state')

exports.setup = async (socket, server, actions) => {
  const notifier = new Notifier(server)

  Object.entries(actions).forEach(([name, action]) => {
    socket.on(name, async (...args) => {
      await notifier.notifyThrow(async () => doIfNotBusy(async () => {
        await server.emit('changed', await getChangedState(true))
        await action(...args, notifier.notify)
        await server.emit('changed', await getChangedState(false))
      }))
    })
  })

  await notifier.notifyThrow(async () => socket.emit('current', await getFullState()))
}
