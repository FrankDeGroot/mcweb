'use strict'

const { join } = require('path')
const { serverPath } = require('../config/config')

const currentVersionName = 'current'
const currentWorldName = 'world'
const versionPath = version => join(serverPath, version)
const worldPath = (version, world) => join(versionPath(version), world)
const currentVersionPath = versionPath(currentVersionName)

exports.currentVersionPath = () => currentVersionPath
exports.currentWorldPath = version => join(versionPath(version), currentWorldName)
exports.serverPath = () => serverPath
exports.versionPath = versionPath
exports.worldPath = worldPath
