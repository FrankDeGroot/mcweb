'use strict'

jest.mock('socket.io')
jest.mock('./utils/log')
jest.mock('./rpc/setup')
jest.mock('./rpc/current')
jest.mock('./worlds/change')
jest.mock('./download/update')
jest.mock('./worlds/create')

const io = require('socket.io')
const { level } = require('./utils/log')
const { setup } = require('./rpc/setup')
const { current } = require('./rpc/current')
const { change } = require('./worlds/change')
const { update } = require('./download/update')
const { create } = require('./worlds/create')

const server = {
  on: jest.fn()
}
const notify = jest.fn()
const serverOnHandlers = {}
server.on.mockImplementation((name, handler) => {
  serverOnHandlers[name] = handler
})
const socket = {}
const version = 'version'
const world = 'world'
const seed = 'seed'

test('server', () => {
  io.mockImplementation(() => server)
  require('./server')

  expect(level).toHaveBeenCalledWith('trace')
  expect(io).toHaveBeenCalledWith(2048)
  expect(server.on).toHaveBeenCalledWith('connection', expect.any(Function))

  serverOnHandlers.connection(socket)

  expect(setup).toHaveBeenCalledWith(socket, server, current, {
    change,
    create,
    update
  })
})
