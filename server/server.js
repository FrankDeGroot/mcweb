'use strict'

const { level } = require('./utils/log')
const { enableAppInsights, logLevel, port } = require('./config/config')

level(logLevel)

require('./utils/monitoring').enableMonitoring(enableAppInsights)

const io = require('socket.io')
const { setup } = require('./rpc/setup')
const { change } = require('./worlds/change')
const { update } = require('./download/update')
const { create } = require('./worlds/create')

const server = io(port)
server.on('connection', socket => setup(socket, server, {
  change,
  create,
  update
}))
