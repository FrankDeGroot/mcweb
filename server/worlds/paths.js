'use strict'

const { join } = require('path')
const { serverPath } = require('../config/config')

const currentVersionName = 'current'
const currentWorldName = 'world'
const getVersionPath = version => join(serverPath, version)
const getWorldPath = (version, world) => join(getVersionPath(version), world)
const getCurrentVersionPath = getVersionPath(currentVersionName)

exports.getCurrentVersionPath = () => getCurrentVersionPath
exports.getCurrentWorldPath = version => join(getVersionPath(version), currentWorldName)
exports.getServerPath = () => serverPath
exports.getVersionPath = getVersionPath
exports.getWorldPath = getWorldPath
exports.getCommonPath = () => join(serverPath, 'common')
