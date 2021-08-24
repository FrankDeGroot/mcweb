'use strict'

import { level, info } from './utils/log.js'
import config from './config/config.js'
import { enableMonitoring } from './utils/monitoring.js'

const { enableAppInsights, logLevel, port } = config
level(logLevel)
enableMonitoring(enableAppInsights)

import { Server } from 'socket.io'
import { setup } from './rpc/setup.js'
import { change } from './worlds/change.js'
import { create } from './worlds/create.js'
import { setGamerules } from './worlds/gamerules.js'
import { update } from './download/update.js'

const server = new Server(port)
server.on('connection', socket => setup(socket, server, {
  change,
  create,
  setGamerules,
  update
}))

process.stdin.on('data', data => {
  info('Received', data)
  if (data.toString() === 'r\n') {
    server.emit('reload')
  }
})