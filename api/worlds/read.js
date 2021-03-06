'use strict'

const { constants, promises } = require('fs')
const { access, lstat, readdir, readlink } = promises
const { join } = require('path')
const {
  getCurrentVersionPath,
  getCurrentWorldPath,
  getServerPath,
  getVersionPath
} = require('./paths')

exports.getCurrentVersion = async () => readCurrent(getCurrentVersionPath())
exports.getCurrentWorld = async version => readCurrent(getCurrentWorldPath(version))
exports.getVersions = async () => directoryFilter(getServerPath(), isVersion)
exports.getWorlds = async version => directoryFilter(getVersionPath(version), isWorld)

async function directoryFilter (path, filter) {
  try {
    const names = await readdir(path)
    const filtered = await Promise.all(names
      .map(async name => {
        const filtered = await filter(join(path, name))
        return filtered ? name : null
      }))
    return filtered
      .filter(name => name)
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(`Unknown path '${path}'`)
    }
    throw err
  }
}

async function isVersion (path) {
  return hasFile(path, 'run.jar')
}

async function isWorld (path) {
  return hasFile(path, 'level.dat')
}

async function readCurrent (path) {
  try {
    return await readlink(path)
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(`Unknown path '${path}'`)
    }
    throw err
  }
}

async function hasFile (path, file) {
  return (await lstat(path)).isDirectory() && (await exists(join(path, file)))
}

async function exists (path) {
  try {
    await access(path, constants.R_OK)
    return true
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false
    }
    throw err
  }
}
