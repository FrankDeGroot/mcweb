'use strict'

const { mkdir, symlink, unlink } = require('fs').promises
const { readServerProperties, writeServerProperties } = require('./mcproperties.js')
const { currentWorldPath, worldPath } = require('./mcpaths')
const { restart } = require('./restart')

exports.create = async (version, world, seed, notify) => {
  const serverProperties = await readServerProperties()
  serverProperties['level-seed'] = seed
  await writeServerProperties(serverProperties)
  await mkdir(worldPath(version, world))
  await restart('Creating a new world', notify, async () => {
    const path = currentWorldPath(version)
    await unlink(path)
    await symlink(world, path)
  })
}
