'use strict'

jest.mock('rcon')
jest.mock('../worlds/serverproperties')

const Rcon = require('rcon')
const { readServerProperties } = require('../worlds/serverproperties')

const { send } = require('./rcon')

describe('send', () => {
  const port = 123
  const password = 'password'
  const message = 'message'
  const response = 'response'
  const error = new Error()
  const handlers = {}
  const connection = {
    connect: jest.fn(),
    once: jest.fn(),
    send: jest.fn(),
    setMaxListeners: jest.fn()
  }
  beforeEach(() => {
    readServerProperties
      .mockReset()
      .mockResolvedValue({ 'rcon.port': port, 'rcon.password': password })
    Rcon
      .mockReset()
      .mockReturnValue(connection)
    connection.once
      .mockReset()
      .mockImplementation((event, handler) => {
        handlers[event] = handler
        return connection
      })
    connection.setMaxListeners.mockImplementation(() => connection)
    connection.connect.mockReset()
    connection.send.mockReset()
  })
  it('should resolve when sent successfully', async () => {
    connection.connect.mockImplementation(() => {
      handlers.auth()
      setTimeout(() => handlers.response('response'), 0)
    })

    await expect(send(message)).resolves.toBe(response)

    expect(Rcon).toHaveBeenCalledWith('localhost', port, password, {
      tcp: true,
      challenge: false
    })
    expect(connection.once).toHaveBeenCalled()
    expect(connection.connect).toHaveBeenCalled()
    expect(connection.send).toHaveBeenCalledWith(message)
  })
  it('should reject when an error event is raised', async () => {
    connection.send.mockImplementation(() => {
      setTimeout(() => handlers.error(error), 0)
    })

    await expect(send(message)).rejects.toBe(error)
  })
})
