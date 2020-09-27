'use strict'

const { join } = require('path')

const serverPath = join('..', 'server')
const currentVersionName = 'current'
const currentWorldName = 'world'
const versionPath = version => join(serverPath, version)
const currentVersionPath = versionPath(currentVersionName)

exports.currentVersionPath = () => currentVersionPath
exports.currentWorldPath = version => join(versionPath(version), currentWorldName)
exports.serverPath = () => serverPath
exports.versionPath = versionPath
