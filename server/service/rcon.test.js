'use strict'

jest.mock('rcon-client')
jest.mock('../worlds/serverproperties')
jest.mock('../utils/cache')

const { Rcon: { connect: rconConnect } } = require('rcon-client')
const { readServerProperties } = require('../worlds/serverproperties')
const { getCachedItem, setCachedItem } = require('../utils/cache')

const { connect, send } = require('./rcon')

describe('send', () => {
  const port = 123
  const password = 'password'
  const message = 'message'
  const response = 'response'
  const connection = {
    send: jest.fn()
  }
  beforeEach(() => {
    getCachedItem.mockReset()
    setCachedItem.mockReset()
    readServerProperties.mockReset()
    rconConnect.mockReset()
    connection.send.mockReset()
  })
  it('should cache connection on connect', async () => {
    readServerProperties
      .mockResolvedValue({ 'rcon.port': port, 'rcon.password': password })
    rconConnect.mockReturnValue(connection)

    await connect()

    expect(rconConnect).toHaveBeenCalledWith({ host: 'localhost', port, password })
    expect(setCachedItem).toHaveBeenCalledWith('connection', connection)
  })
  it('should not connect again', async () => {
    getCachedItem.mockReturnValue(connection)

    await connect()

    expect(readServerProperties).not.toHaveBeenCalled()
    expect(rconConnect).not.toHaveBeenCalled()
  })
  it('should send on cached connection', async () => {
    getCachedItem.mockReturnValue(connection)
    connection.send.mockResolvedValue(response)

    await expect(send(message)).resolves.toBe(response)

    expect(connection.send).toHaveBeenCalledWith(message)
  })
})
