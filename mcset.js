'use strict'

const { symlink, unlink } = require('fs').promises
const {
  currentVersionPath,
  currentWorldPath
} = require('./mcpaths')
const {
  currentVersion,
  currentWorld
} = require('./mcget')
const { restart } = require('./restart')

exports.change = async (version, world, notify) => {
  const nowVersion = await currentVersion()
  const nowWorld = await currentWorld(version)
  if (version === nowVersion && world === nowWorld) {
    notify('Already current')
    return
  }
  await restart(`Switching to ${version} with ${world}`, notify, async () => {
    await setVersion(version)
    await setWorld(version, world)
  })
}

async function setVersion (version) {
  await unlink(currentVersionPath())
  await symlink(version, currentVersionPath())
}

async function setWorld (version, world) {
  const path = currentWorldPath(version)
  await unlink(path)
  await symlink(world, path)
}
