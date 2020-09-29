'use strict'

jest.mock('socket.io')
jest.mock('./log')
jest.mock('./rpc/setup')

const { listen } = require('socket.io')
const { level } = require('./log')
const { setup } = require('./rpc/setup')

const server = {
  on: jest.fn()
}

listen.mockImplementation(() => server)

const serverOnHandlers = {}
server.on.mockImplementation((name, handler) => {
  serverOnHandlers[name] = handler
})

const socket = {}

test('server', () => {
  require('./server')

  expect(level).toHaveBeenCalledWith('info')
  expect(listen).toHaveBeenCalledWith(1024)
  expect(server.on).toHaveBeenCalledWith('connection', expect.any(Function))

  serverOnHandlers.connection(socket)

  expect(setup).toHaveBeenCalledWith(socket, server)
})
