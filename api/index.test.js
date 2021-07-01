'use strict'

jest.mock('socket.io')
jest.mock('./utils/log')
jest.mock('./utils/monitoring')
jest.mock('./rpc/setup')
jest.mock('./worlds/change')
jest.mock('./download/update')
jest.mock('./worlds/create')

const { level } = require('./utils/log')
const { enableMonitoring } = require('./utils/monitoring')
const io = require('socket.io')
const { setup } = require('./rpc/setup')
const { change } = require('./worlds/change')
const { create } = require('./worlds/create')
const { setGamerules } = require('./worlds/gamerules')
const { update } = require('./download/update')

const stdin = {
  on: jest.fn()
}
global.process = {
  stdin: stdin
}
const server = {
  on: jest.fn()
}
const serverOnHandlers = {}
server.on.mockImplementation((name, handler) => {
  serverOnHandlers[name] = handler
})
const socket = {}

test('server', () => {
  io.mockImplementation(() => server)
  require('./index')

  expect(level).toHaveBeenCalledWith('trace')
  expect(enableMonitoring).toHaveBeenCalledWith(false)
  expect(io).toHaveBeenCalledWith(2048)
  expect(server.on).toHaveBeenCalledWith('connection', expect.any(Function))

  serverOnHandlers.connection(socket)

  expect(setup).toHaveBeenCalledWith(socket, server, {
    change,
    create,
    setGamerules,
    update
  })

  expect(stdin.on).toHaveBeenCalledWith('data', expect.any(Function))
})
