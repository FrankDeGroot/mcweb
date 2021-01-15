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
const { doIfNotBusy, isBusy } = require('../utils/busy')

exports.current = async () => {
  const versions = await getVersions()
  const versionWorlds = await Promise.all(versions.map(async version => {
    return {
      [version]: {
        worlds: await getWorlds(version),
        world: await getCurrentWorld(version)
      }
    }
  }))
  return {
    versions: versionWorlds.reduce((acc, version) => {
      return { ...acc, ...version }
    }, {}),
    version: await getCurrentVersion(),
    operators: await getOperators(),
    busy: isBusy()
  }
}

exports.change = (notify, { version, world }) => {
  return doIfNotBusy(() => change(version, world, notify))
}

exports.update = (notify, { version }) => {
  return doIfNotBusy(() => update(version, notify))
}

exports.create = (notify, { version, world, seed }) => {
  return doIfNotBusy(() => create(version, world, seed, notify))
}
