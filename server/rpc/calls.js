'use strict'

const {
  versions,
  currentVersion,
  worlds,
  currentWorld
} = require('../worlds/read')
const { change } = require('../worlds/change')
const { update } = require('../update/update')
const { create } = require('../worlds/create')

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

exports.create = (notify, createParameters) => {
  const { version, world, seed } = createParameters
  return create(version, world, seed, notify)
}
