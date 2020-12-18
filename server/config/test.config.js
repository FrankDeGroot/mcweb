'use strict'

Object.assign(module.exports, {
  enableAppInsights: false,
  logLevel: 'trace',
  manifestUrl: 'https://launchermeta.mojang.com/mc/game/version_manifest.json',
  playerUrl: 'https://api.mojang.com/users/profiles/minecraft/(player)',
  port: 2048,
  serverPath: '../test/server'
})
