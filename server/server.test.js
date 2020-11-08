'use strict'

jest.mock('socket.io')
jest.mock('./utils/log')
jest.mock('./rpc/setup')

const io = require('socket.io')
const { level } = require('./utils/log')
const { setup } = require('./rpc/setup')

const server = {
  on: jest.fn()
}

io.mockImplementation(() => server)

const serverOnHandlers = {}
server.on.mockImplementation((name, handler) => {
  serverOnHandlers[name] = handler
})

const socket = {}

test('server', () => {
  require('./server')

  expect(level).toHaveBeenCalledWith('trace')
  expect(io).toHaveBeenCalledWith(1234)
  expect(server.on).toHaveBeenCalledWith('connection', expect.any(Function))

  serverOnHandlers.connection(socket)

  expect(setup).toHaveBeenCalledWith(socket, server)
})
