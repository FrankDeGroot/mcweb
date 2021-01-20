'use strict'

const {
  getCurrentVersion,
  getCurrentWorld,
  getVersions,
  getWorlds
} = require('../worlds/read')
const { getOperators } = require('../players/operators')
const { isBusy } = require('../utils/busy')

exports.getCurrentState = () => getState(isBusy())

exports.getChangedState = async busy => {
  if (busy) {
    return {
      busy: true
    }
  }
  return getState(false)
}

async function getState (busy) {
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
    busy
  }
}
