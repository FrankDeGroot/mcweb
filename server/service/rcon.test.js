'use strict'

jest.mock('rcon-client')
jest.mock('../worlds/serverproperties')
jest.mock('../utils/cache')

const { Rcon: { connect: rconConnect } } = require('rcon-client')
const { readServerProperties } = require('../worlds/serverproperties')
const { cache } = require('../utils/cache')

const connectionCache = {
  store: jest.fn(),
  read: jest.fn(),
  evict: jest.fn()
}
cache.mockReturnValue(connectionCache)

const { connect, send } = require('./rcon')

describe('rcon', () => {
  const port = 123
  const password = 'password'
  const connection = {
    send: jest.fn()
  }
  const request = 'request'
  const response = 'response'
  const sendError = new Error('Send error')
  beforeEach(() => {
    connectionCache.store.mockReset()
    connectionCache.read.mockReset()
    connectionCache.evict.mockReset()
    readServerProperties.mockReset()
    rconConnect.mockReset()
    connection.send.mockReset()
  })
  it('should cache connection on connect', async () => {
    connectionCache.store.mockImplementation(async create => {
      await expect(create()).resolves.toBe(connection)
    })
    readServerProperties.mockResolvedValue({
      'rcon.port': port,
      'rcon.password': password
    })
    rconConnect.mockResolvedValue(connection)

    await connect()

    expect(readServerProperties).toHaveBeenCalled()
    expect(rconConnect).toHaveBeenCalledWith({ host: 'localhost', port, password })
  })
  it('should send on cached connection', async () => {
    connectionCache.read.mockImplementation(otherwise => {
      expect(otherwise).toThrow(new Error('Not connected'))
      return connection
    })
    connection.send.mockResolvedValue(response)

    await expect(send(request)).resolves.toBe(response)

    expect(connection.send).toHaveBeenCalledWith(request)
  })
  it('should evict connection on send error', async () => {
    connectionCache.read.mockImplementation(otherwise => {
      expect(otherwise).toThrow(new Error('Not connected'))
      return connection
    })
    connection.send.mockRejectedValue(sendError)

    await expect(send(request)).rejects.toBe(sendError)

    expect(connection.send).toHaveBeenCalledWith(request)
    expect(connectionCache.evict).toHaveBeenCalled()
  })
})
