'use strict'

const {
  getCurrentVersion,
  getCurrentWorld,
  getVersions,
  getWorlds
} = require('../worlds/read')
const { change } = require('../worlds/change')
const { update } = require('../download/update')
const { create } = require('../worlds/create')
const { getOperators } = require('../players/operators')

exports.current = async () => {
  return {
    versions: (await Promise.all((await getVersions()).map(async version => {
      return {
        [version]: {
          worlds: await getWorlds(version),
          world: await getCurrentWorld(version)
        }
      }
    }))).reduce((acc, version) => {
      return { ...acc, ...version }
    }, {}),
    version: await getCurrentVersion(),
    ops: await getOperators()
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
