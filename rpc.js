'use strict'

const { info, log } = require('./log')

const {
  versions,
  currentVersion,
  worlds,
  currentWorld
} = require('./mcget')
const {
  change
} = require('./mcset')
const {
  update
} = require('./update/update')

exports.setup = (socket, server) => {
  function notify (message) {
    info(message)
    server.emit('message', message)
  }

  async function longReply (doing, done, action) {
    server.emit(doing)
    try {
      await action()
    } catch (err) {
      replyError(err)
    } finally {
      server.emit(done)
    }
  }

  async function reply (name, getReply) {
    try {
      socket.emit(name, await getReply())
    } catch (err) {
      replyError(err)
    }
  }

  function replyError (err) {
    log(err.code ? 'error' : 'info', err)
    socket.emit('throw', err.code ? 'An internal error occurred' : err.message)
  }

  socket.replyOn = (name, replier) =>
    socket.on(name, (...args) =>
      reply(name, () => replier(...args)))

  socket.longReplyOn = (name, doing, done, replier) =>
    socket.on(name, (...args) =>
      longReply(doing, done, () => replier(...args)))

  socket
    .replyOn('worlds', async version => ({
      worlds: await worlds(version),
      world: await currentWorld(version)
    }))
    .replyOn('current', async () => {
      const version = await currentVersion()
      return {
        versions: await versions(),
        version: version,
        worlds: await worlds(version),
        world: await currentWorld(version)
      }
    })
    .longReplyOn('change', 'changing', 'changed', changeParameters => {
      const { version, world } = changeParameters
      return change(version, world, message => notify(message))
    })
    .longReplyOn('update', 'updating', 'updated', updateParameters => {
      const { version } = updateParameters
      return update(version, message => notify(message))
    })
}
