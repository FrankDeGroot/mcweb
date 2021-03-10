'use strict'

const {
  getVersions,
  getWorlds,
  getCurrentWorld
} = require('../worlds/read')

exports.getVersionsWorlds = async () => {
  const versions = await getVersions()
  const versionWorlds = await Promise.all(versions.map(async version => ({
    [version]: {
      worlds: await getWorlds(version),
      world: await getCurrentWorld(version)
    }
  })))
  return versionWorlds.reduce((acc, version) => ({ ...acc, ...version }), {})
}
