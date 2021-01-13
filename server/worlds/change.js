'use strict'

const { symlink, unlink } = require('fs').promises
const {
  getCurrentVersionPath,
  getCurrentWorldPath
} = require('./paths')
const {
  getCurrentVersion,
  getCurrentWorld
} = require('./read')
const { restart } = require('../service/restart')

exports.change = async (version, world, notify) => {
  const currentVersion = await getCurrentVersion()
  const currentWorld = await getCurrentWorld(version)
  if (version === currentVersion && world === currentWorld) {
    notify('Already current')
    return
  }
  await restart(`Switching to ${version} with ${world}`, notify, async () => {
    await setVersion(version)
    await setWorld(version, world)
  })
}

async function setVersion (version) {
  await unlink(getCurrentVersionPath())
  await symlink(version, getCurrentVersionPath())
}

async function setWorld (version, world) {
  const path = getCurrentWorldPath(version)
  await unlink(path)
  await symlink(world, path)
}
