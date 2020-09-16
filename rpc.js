'use strict'

const { log } = require('./log')

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
} = require('./update')

exports.setup = socket => socket
  .on('worlds', async version =>
    safeEmit(socket, 'worlds', async () => ({
      worlds: await worlds(version),
      world: await currentWorld(version)
    }))
  )
  .on('current', async () =>
    safeEmit(socket, 'current', async () => {
      const version = await currentVersion()
      return {
        versions: await versions(),
        version: version,
        worlds: await worlds(version),
        world: await currentWorld(version)
      }
    })
  )
  .on('change', async changeParameters => {
    progressive(socket, 'changing', 'changed', async () => {
      const { version, world } = changeParameters
      await change(version, world, message => socket.emit('message', message))
    })
  })
  .on('update', async updateParameters => {
    progressive(socket, 'updating', 'updated', async () => {
      const { version } = updateParameters
      await update(version, message => socket.emit('message', message))
    })
  })

async function progressive (socket, doing, done, action) {
  socket.emit(doing)
  try {
    await action()
  } catch (err) {
    catchErr(socket, err)
  } finally {
    socket.emit(done)
  }
}

async function safeEmit (socket, name, buildMessage) {
  try {
    socket.emit(name, await buildMessage())
  } catch (err) {
    catchErr(socket, err)
  }
}

async function catchErr (socket, err) {
  const message = err.code ? 'An internal error occurred' : err.message
  log(err.code ? 'error' : 'info', err)
  socket.emit('throw', message)
}
