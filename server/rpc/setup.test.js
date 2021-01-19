'use strict'

jest.mock('../utils/log')
jest.mock('../utils/busy')

const { info, log } = require('../utils/log')
const { doIfNotBusy } = require('../utils/busy')

const { setup } = require('./setup')

const socket = {
  on: jest.fn(),
  emit: jest.fn()
}
const socketHandlers = {}
const server = {
  emit: jest.fn()
}
const current = jest.fn()
const actions = {
  action1: jest.fn()
}
const arg = {}
const emittedCurrent = {}
const message = 'message'
const internalErrorMessage = 'internalErrorMessage'
const internalError = new Error(internalErrorMessage)
const externalError = new Error()
externalError.code = 'SOME_CODE'

describe('setup', () => {
  beforeEach(() => {
    socket.on.mockReset()
    socket.emit.mockReset()
    server.emit.mockReset()
    actions.action1.mockReset()
    info.mockReset()
    log.mockReset()
    socket.on.mockImplementation((event, handler) => {
      socketHandlers[event] = handler
    })
  })
  it('should emit current state and set up handlers for actions', async () => {
    current.mockResolvedValue(emittedCurrent)
    await setup(socket, server, current, actions)
    expect(socket.emit).toHaveBeenCalledWith('current', emittedCurrent)

    doIfNotBusy.mockImplementation(async handler => {
      await handler()
      expect(current).toHaveBeenCalled()
      expect(server.emit).toHaveBeenCalledWith('current', emittedCurrent)
      expect(actions.action1).toHaveBeenCalledWith(arg, expect.any(Function))

      const notify = actions.action1.mock.calls[0][1]
      notify(message)
      expect(info).toHaveBeenCalledWith(message)
      expect(server.emit).toHaveBeenCalledWith('message', message)
    })
    await socketHandlers.action1(arg)
    expect(doIfNotBusy).toHaveBeenCalledWith(expect.any(Function))
  })
  it('should emit "throw" when current rejects with internal error', async () => {
    current.mockRejectedValue(internalError)
    await setup(socket, server, current, actions)
    expect(socket.emit).not.toHaveBeenCalled()
    expect(log).toHaveBeenCalledWith('info', internalError)
    expect(server.emit).toHaveBeenCalledWith('throw', internalErrorMessage)
  })
  it('should emit "throw" when current rejects with external error', async () => {
    current.mockRejectedValue(externalError)
    await setup(socket, server, current, actions)
    expect(socket.emit).not.toHaveBeenCalled()
    expect(log).toHaveBeenCalledWith('error', externalError)
    expect(server.emit).toHaveBeenCalledWith('throw', 'An internal error occurred')
  })
})
