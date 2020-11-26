'use strict'

const { level, error } = require('./utils/log')
const { enableAppInsights, logLevel, port } = require('./config/config')

level(logLevel)

if (enableAppInsights) {
  try {
    require('applicationinsights').setup(require('../.keys').applicationInsightsInstrumentationKey).start()
  } catch (caught) {
    error('Error starting Application Insights', caught)
  }
}

const io = require('socket.io')
const { setup } = require('./rpc/setup')
const server = io(port)
server.on('connection', socket => setup(socket, server))
