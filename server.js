#!/usr/bin/node
'use strict'

const { listen } = require('socket.io')
const { level } = require('./log')
const { setup } = require('./rpc/setup')

level('info')

const server = listen(1024)
server.on('connection', socket => setup(socket, server))
