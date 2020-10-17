'use strict'

jest.mock('rcon')

jest.mock('../utils/log')
jest.mock('../utils/sleep')
jest.mock('../worlds/serverproperties')

const Rcon = require('rcon')
const con = {
  on: jest.fn(),
  connect: jest.fn(),
  disconnect: jest.fn(),
  send: jest.fn()
}

const { info, trace } = require('../utils/log')
const { sleep } = require('../utils/sleep')
const { readServerProperties } = require('../worlds/serverproperties')

const PORT = 123
const PASSWORD = 'password'

const { say } = require('./rcon')

describe('say', () => {
  const handlers = {}

  beforeEach(() => {
    readServerProperties
      .mockReset()
      .mockResolvedValue({ 'rcon.port': PORT, 'rcon.password': PASSWORD })
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
    trace.mockReset()
    sleep.mockReset()
  })
  it('should resolve when sent successfully', async () => {
    con.connect.mockImplementation(() => {
      handlers.auth()
      handlers.response('response')
      handlers.end()
    })

    await say('hello')

    expect(Rcon).toHaveBeenCalledWith('localhost', PORT, PASSWORD, {
      tcp: true,
      challenge: false
    })
    expect(con.on).toHaveBeenCalled()
    expect(con.connect).toHaveBeenCalled()
    expect(con.send).toHaveBeenCalledWith('say hello')
    expect(con.disconnect).toHaveBeenCalled()

    expect(info).toHaveBeenCalledWith('rcon response', 'response')
  })
  it('should retry when not sent successfully first', async () => {
    con.connect
      .mockImplementationOnce(() => {
        handlers.error({ code: 'ECONNREFUSED' })
      })
      .mockImplementationOnce(() => {
        handlers.auth()
        handlers.response('response')
        handlers.end()
      })

    await say('hello')
  })
  it('should reject when not sent successfully repeatedly', async () => {
    con.connect.mockImplementation(() => {
      handlers.error({ code: 'ECONNREFUSED' })
    })

    await expect(() => say('hello')).rejects.toEqual(new Error('Server failed to restart'))

    expect(con.connect.mock.calls.length).toBe(120)
    expect(sleep.mock.calls.length).toBe(120)
  })
  it('should reject immediately when another error occurs', async () => {
    const ERR = {}
    con.connect.mockImplementation(() => {
      handlers.error(ERR)
    })

    await expect(() => say('hello')).rejects.toEqual(ERR)

    expect(con.connect.mock.calls.length).toBe(1)
    expect(sleep.mock.calls.length).toBe(0)
  })
})
