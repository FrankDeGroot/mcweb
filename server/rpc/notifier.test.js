'use strict'

jest.mock('../utils/log')

const { info, log } = require('../utils/log')

const { Notifier } = require('./notifier')

describe('notifier', () => {
  const message = 'message'
  const internalErrorMessage = 'internalErrorMessage'
  const internalError = new Error(internalErrorMessage)
  const externalError = new Error()
  externalError.code = 'SOME_CODE'
  const server = {
    emit: jest.fn()
  }
  const action = jest.fn()
  let notifier
  beforeEach(() => {
    server.emit.mockReset()
    notifier = new Notifier(server)
  })
  describe('notify', () => {
    it('should log and emit', () => {
      notifier.notify(message)
      expect(info).toHaveBeenCalledWith(message)
      expect(server.emit).toHaveBeenCalledWith('message', message)
    })
  })
  describe('notifyThrow', () => {
    it('should not log or emit action that does not throw', async () => {
      action.mockResolvedValue(message)
      await expect(notifier.notifyThrow(action)).resolves.toBe(message)
    })
    it('should info log and emit when action throws internal error', async () => {
      action.mockImplementation(() => {
        throw internalError
      })
      await notifier.notifyThrow(action)
      expect(log).toHaveBeenCalledWith('info', internalError)
      expect(server.emit).toHaveBeenCalledWith('throw', internalErrorMessage)
    })
    it('should info log and emit action rejects with internal error', async () => {
      action.mockRejectedValue(internalError)
      await notifier.notifyThrow(action)
      expect(log).toHaveBeenCalledWith('info', internalError)
      expect(server.emit).toHaveBeenCalledWith('throw', internalErrorMessage)
    })
    it('should info log and emit when action throws external error', async () => {
      action.mockImplementation(() => {
        throw externalError
      })
      await notifier.notifyThrow(action)
      expect(log).toHaveBeenCalledWith('error', externalError)
      expect(server.emit).toHaveBeenCalledWith('throw', 'An internal error occurred')
    })
    it('should info log and emit action rejects with external error', async () => {
      action.mockRejectedValue(externalError)
      await notifier.notifyThrow(action)
      expect(log).toHaveBeenCalledWith('error', externalError)
      expect(server.emit).toHaveBeenCalledWith('throw', 'An internal error occurred')
    })
  })
})
