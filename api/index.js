'use strict'

const { level, info } = require('./utils/log')
const { enableAppInsights, logLevel, port } = require('./config/config')

level(logLevel)

require('./utils/monitoring').enableMonitoring(enableAppInsights)

const io = require('socket.io')
const { setup } = require('./rpc/setup')
const { change } = require('./worlds/change')
const { create } = require('./worlds/create')
const { setGamerules } = require('./worlds/gamerules')
const { update } = require('./download/update')

const server = io(port)
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