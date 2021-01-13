'use strict'

const { symlink, unlink } = require('fs').promises
const {
  getCurrentVersionPath,
  getCurrentWorldPath
} = require('./paths')
const {
  currentVersion,
  currentWorld
} = require('./read')
const { restart } = require('../service/restart')

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
  await unlink(getCurrentVersionPath())
  await symlink(version, getCurrentVersionPath())
}

async function setWorld (version, world) {
  const path = getCurrentWorldPath(version)
  await unlink(path)
  await symlink(world, path)
}
