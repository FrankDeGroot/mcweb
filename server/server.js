'use strict'

const io = require('socket.io')
const { level } = require('./utils/log')
const { setup } = require('./rpc/setup')

level('info')

const server = io(1024)
server.on('connection', socket => setup(socket, server))
