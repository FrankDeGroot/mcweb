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

exports.setup = socket => socket
  .on('worlds', version =>
    reply(socket, 'worlds', async () => ({
      worlds: await worlds(version),
      world: await currentWorld(version)
    }))
  )
  .on('current', () =>
    reply(socket, 'current', async () => {
      const version = await currentVersion()
      return {
        versions: await versions(),
        version: version,
        worlds: await worlds(version),
        world: await currentWorld(version)
      }
    })
  )
  .on('change', changeParameters => {
    progressive(socket, 'changing', 'changed', async () => {
      const { version, world } = changeParameters
      await change(version, world, message => notify(socket, message))
    })
  })
  .on('update', updateParameters => {
    progressive(socket, 'updating', 'updated', async () => {
      const { version } = updateParameters
      await update(version, message => notify(socket, message))
    })
  })

function notify (socket, message) {
  info(message)
  socket.emit('message', message)
}

async function progressive (socket, doing, done, action) {
  socket.emit(doing)
  try {
    await action()
  } catch (err) {
    replyError(socket, err)
  } finally {
    socket.emit(done)
  }
}

async function reply (socket, name, buildMessage) {
  try {
    socket.emit(name, await buildMessage())
  } catch (err) {
    replyError(socket, err)
  }
}

function replyError (socket, err) {
  const message = err.code ? 'An internal error occurred' : err.message
  log(err.code ? 'error' : 'info', err)
  socket.emit('throw', message)
}
