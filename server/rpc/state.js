'use strict'

const { getVersionsWorlds } = require('../worlds/versions_worlds')
const { getCurrentVersion } = require('../worlds/read')
const { getGamerules } = require('../worlds/gamerules')
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
  return {
    versions: await getVersionsWorlds(),
    version: await getCurrentVersion(),
    operators: await getOperators(),
    gamerules: await getGamerules(),
    busy
  }
}
