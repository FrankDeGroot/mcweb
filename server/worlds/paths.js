'use strict'

const { join } = require('path')
const { serverPath } = require('../config/config')

const currentVersionName = 'current'
const currentWorldName = 'world'
const getVersionPath = version => join(serverPath, version)
const getWorldPath = (version, world) => join(getVersionPath(version), world)
const currentVersionPath = getVersionPath(currentVersionName)

exports.currentVersionPath = () => currentVersionPath
exports.currentWorldPath = version => join(getVersionPath(version), currentWorldName)
exports.serverPath = () => serverPath
exports.versionPath = getVersionPath
exports.worldPath = getWorldPath
exports.getCommonPath = () => join(serverPath, 'common')
