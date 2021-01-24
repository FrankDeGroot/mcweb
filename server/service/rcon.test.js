'use strict'

jest.mock('rcon')

jest.mock('../utils/log')
jest.mock('../worlds/serverproperties')

const Rcon = require('rcon')
const { info } = require('../utils/log')
const { readServerProperties } = require('../worlds/serverproperties')

const { send } = require('./rcon')

describe('send', () => {
  const port = 123
  const password = 'password'
  const message = 'message'
  const response = 'response'
  const error = new Error()
  const handlers = {}
  const con = {
    on: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
    send: jest.fn()
  }
  beforeEach(() => {
    readServerProperties
      .mockReset()
      .mockResolvedValue({ 'rcon.port': port, 'rcon.password': password })
    Rcon
      .mockReset()
      .mockReturnValue(con)
    con.on
      .mockReset()
      .mockImplementation((event, handler) => {
        handlers[event] = handler
        return con
      })
    con.connect.mockReset()
    con.send.mockReset()
    info.mockReset()
  })
  it('should resolve when sent successfully', async () => {
    con.connect.mockImplementation(() => {
      handlers.auth()
      handlers.response('response')
      handlers.end()
    })

    await expect(send(message)).resolves.toBe(response)

    expect(Rcon).toHaveBeenCalledWith('localhost', port, password, {
      tcp: true,
      challenge: false
    })
    expect(con.on).toHaveBeenCalled()
    expect(con.connect).toHaveBeenCalled()
    expect(con.send).toHaveBeenCalledWith(message)
    expect(con.disconnect).toHaveBeenCalled()

    expect(info).toHaveBeenCalledWith('rcon response', 'response')
  })
  it('should reject when an error event is raised', async () => {
    con.connect.mockImplementation(() => {
      handlers.error(error)
    })

    await expect(send(message)).rejects.toBe(error)
  })
})
