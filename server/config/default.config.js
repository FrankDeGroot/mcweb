'use strict'

Object.assign(module.exports, {
  enableAppInsights: true,
  logLevel: 'info',
  manifestUrl: 'https://launchermeta.mojang.com/mc/game/version_manifest.json',
  playerUrl: 'https://api.mojang.com/users/profiles/minecraft/(player)',
  port: 1024,
  serverPath: '../server'
})
