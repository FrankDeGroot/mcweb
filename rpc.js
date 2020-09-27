'use strict'

const { Replier } = require('./rpc_reply')
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

exports.setup = (socket, server) => new Replier(socket, server)
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
  .longReplyOn('change', 'changing', 'changed', (notify, changeParameters) => {
    const { version, world } = changeParameters
    return change(version, world, notify)
  })
  .longReplyOn('update', 'updating', 'updated', (notify, updateParameters) => {
    const { version } = updateParameters
    return update(version, notify)
  })
