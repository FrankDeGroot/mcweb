#!/usr/bin/node
'use strict'

const io = require('socket.io')
const { level } = require('./log')
const { setup } = require('./rpc')

level('info')

const server = io.listen(1024)
server.on('connection', socket => setup(socket, server))
