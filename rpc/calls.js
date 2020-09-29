'use strict'

const {
  versions,
  currentVersion,
  worlds,
  currentWorld
} = require('./../mcget')
const { change } = require('./../mcset')
const { update } = require('./../update/update')

exports.worlds = async version => ({
  worlds: await worlds(version),
  world: await currentWorld(version)
})

exports.current = async () => {
  const version = await currentVersion()
  return {
    versions: await versions(),
    version: version,
    worlds: await worlds(version),
    world: await currentWorld(version)
  }
}

exports.change = (notify, changeParameters) => {
  const { version, world } = changeParameters
  return change(version, world, notify)
}

exports.update = (notify, updateParameters) => {
  const { version } = updateParameters
  return update(version, notify)
}
