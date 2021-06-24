'use strict'

jest.mock('../utils/busy')
jest.mock('./state')
jest.mock('./notifier')

const { doIfNotBusy } = require('../utils/busy')
const { getCurrentState: getFullState, getChangedState } = require('./state')
const { Notifier } = require('./notifier')

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
    action: jest.fn()
  }
  const notifier = {
    notify: jest.fn(),
    notifyThrow: jest.fn()
  }
  const arg = { arg: 'arg' }
  const fullState = { fullState: 'fullState' }
  function doIfNotBusyHandler () {
    return doIfNotBusy.mock.calls[0][0]
  }
  function notifyThrowHandler () {
    return notifier.notifyThrow.mock.calls[0][0]
  }
  beforeAll(async () => {
    Notifier.mockReturnValue(notifier)
    getFullState.mockResolvedValue(fullState)
    socketHandlers = {}
    socket.on.mockImplementation((event, handler) => {
      socketHandlers[event] = handler
    })
    await setup(socket, server, actions)
  })
  it('should emit full state to connecting socket', async () => {
    expect(Notifier).toHaveBeenCalledWith(server)
    expect(notifier.notifyThrow).toHaveBeenCalledWith(expect.any(Function))

    await notifyThrowHandler()()

    expect(socket.emit).toHaveBeenCalledWith('current', fullState)
  })
  it('should setup action handlers on socket', async () => {
    expect(socket.on).toHaveBeenCalledTimes(1)
    expect(socket.on).toHaveBeenCalledWith('action', expect.any(Function))
  })
  it('should setup socket action handler to emit error on throw', async () => {
    notifier.notifyThrow.mockReset()
    await socketHandlers.action(arg)
    expect(notifier.notifyThrow).toHaveBeenCalledWith(expect.any(Function))
  })
  it('should setup socket action handler to only do if not busy', async () => {
    await notifyThrowHandler()()

    expect(doIfNotBusy).toHaveBeenCalledWith(expect.any(Function))
  })
  it('should setup action to do if not busy', async () => {
    getChangedState.mockImplementation(async busy => {
      return { busy }
    })

    await doIfNotBusyHandler()()

    expect(server.emit).toHaveBeenCalledWith('changed', { busy: true })
    expect(server.emit).toHaveBeenCalledWith('changed', { busy: false })
    expect(actions.action).toHaveBeenCalledWith(arg, notifier.notify)
  })
})
