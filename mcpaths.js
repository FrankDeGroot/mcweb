'use strict'

const { join } = require('path')

const serverPath = join('..', 'server')
const currentVersionName = 'current'
const currentWorldName = 'world'
const versionPath = version => join(serverPath, version)

exports.currentVersionPath = versionPath(currentVersionName)
exports.currentWorldPath = version => join(versionPath(version), currentWorldName)
exports.serverPath = serverPath
exports.versionPath = versionPath
