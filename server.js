#!/usr/bin/node
'use strict'

const io = require('socket.io')
const server = require('http').createServer()
const { info, level } = require('./log')
const { setup } = require('./rpc')

level('info')

io(server).on('connection', setup)

server.listen(1024, err => {
  if (err) throw err
  info('Server running')
})
