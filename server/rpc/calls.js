'use strict'

const get = require('../worlds/read')
const { change } = require('../worlds/change')
const { update } = require('../download/update')
const { create } = require('../worlds/create')
const { operators } = require('../players/ops')

exports.current = async () => {
  return {
    versions: (await Promise.all((await get.versions()).map(async version => {
      return {
        [version]: {
          worlds: await get.worlds(version),
          world: await get.currentWorld(version)
        }
      }
    }))).reduce((acc, version) => {
      return { ...acc, ...version }
    }, {}),
    version: await get.currentVersion(),
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
