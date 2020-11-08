'use strict'

const io = require('socket.io')
const { level } = require('./utils/log')
const { setup } = require('./rpc/setup')
const { logLevel, port } = require('./config/config')

level(logLevel)

const server = io(port)
server.on('connection', socket => setup(socket, server))
