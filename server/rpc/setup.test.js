'use strict'

jest.mock('../utils/log')
jest.mock('../utils/busy')
jest.mock('./state')

const { info, log } = require('../utils/log')
const { doIfNotBusy } = require('../utils/busy')
const { getCurrentState: getFullState, getChangedState } = require('./state')

const { setup } = require('./setup')

describe('setup', () => {
  const socket = {
    on: jest.fn(),
    emit: jest.fn()
  }
  let socketHandlers
  const server = {
    emit: jest.fn()
  }
  const actions = {
    action1: jest.fn()
  }
  const arg = { arg: 'arg' }
  const fullState = { fullState: 'fullState' }
  const changedState = { changedState: 'changedState' }
  const message = 'message'
  const internalErrorMessage = 'internalErrorMessage'
  const internalError = new Error(internalErrorMessage)
  const externalError = new Error()
  externalError.code = 'SOME_CODE'
  beforeEach(() => {
    info.mockReset()
    log.mockReset()
    doIfNotBusy.mockReset()
    getChangedState.mockReset().mockResolvedValue(changedState)
    getFullState.mockReset().mockResolvedValue(fullState)
    socket.on.mockReset()
    socket.emit.mockReset()
    server.emit.mockReset()
    actions.action1.mockReset()
    socketHandlers = {}
    socket.on.mockImplementation((event, handler) => {
      socketHandlers[event] = handler
    })
  })
  it('should emit full state and set up handlers for actions', async () => {
    await setup(socket, server, actions)

    expect(socket.emit).toHaveBeenCalledWith('current', fullState)

    doIfNotBusy.mockImplementation(async handler => {
      await handler()
      expect(getChangedState).toHaveBeenCalledTimes(2)
      expect(server.emit).toHaveBeenCalledWith('changed', changedState)
      expect(actions.action1).toHaveBeenCalledWith(arg, expect.any(Function))

      const notify = actions.action1.mock.calls[0][1]
      notify(message)
      expect(info).toHaveBeenCalledWith(message)
      expect(server.emit).toHaveBeenCalledWith('message', message)
    })
    await socketHandlers.action1(arg)
    expect(doIfNotBusy).toHaveBeenCalledWith(expect.any(Function))
  })
  it('should emit "throw" when getFullState rejects with internal error', async () => {
    getFullState.mockRejectedValue(internalError)
    await setup(socket, server, actions)
    expect(socket.emit).not.toHaveBeenCalled()
    expect(log).toHaveBeenCalledWith('info', internalError)
    expect(server.emit).toHaveBeenCalledWith('throw', internalErrorMessage)
  })
  it('should emit "throw" when getFullState rejects with external error', async () => {
    getFullState.mockRejectedValue(externalError)
    await setup(socket, server, actions)
    expect(socket.emit).not.toHaveBeenCalled()
    expect(log).toHaveBeenCalledWith('error', externalError)
    expect(server.emit).toHaveBeenCalledWith('throw', 'An internal error occurred')
  })
})
