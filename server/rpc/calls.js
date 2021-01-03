'use strict'

const {
  versions,
  currentVersion,
  worlds,
  currentWorld
} = require('../worlds/read')
const { change } = require('../worlds/change')
const { update } = require('../download/update')
const { create } = require('../worlds/create')
const { operators } = require('../players/ops')

exports.current = async () => {
  return {
    versions: await Promise.all((await versions()).map(async version => {
      return {
        version,
        worlds: await worlds(version),
        world: await currentWorld(version)
      }
    })),
    version: await currentVersion(),
    ops: await operators()
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
