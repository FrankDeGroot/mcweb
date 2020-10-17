'use strict'

jest.mock('../utils/log')
const { info } = require('../utils/log')

const { Replier } = require('./replier')

describe('Replier', () => {
  const error = new Error('error message')
  const socket = {
    emit: jest.fn(),
    on: jest.fn()
  }
  const server = {
    emit: jest.fn()
  }
  let replier
  let socketOnHandlers
  beforeEach(() => {
    socket.emit.mockReset()
    socket.on.mockReset()
    server.emit.mockReset()
    socketOnHandlers = {}
    socket.on.mockImplementation((name, handler) => {
      socketOnHandlers[name] = handler
      return socket
    })
    replier = new Replier(socket, server)
  })
  describe('replyOn', () => {
    it('should register handler to reply', async () => {
      expect(replier.replyOn('name', async parameter => {
        expect(parameter).toBe('parameter')
        return 'reply'
      })).toBe(replier)

      await socketOnHandlers.name('parameter')

      expect(socket.emit).toHaveBeenCalledWith('name', 'reply')
    })
    it('should register handler to emit "throw" when getting reply throws', async () => {
      expect(replier.replyOn('name', async parameter => {
        expect(parameter).toBe('parameter')
        throw error
      })).toBe(replier)

      await socketOnHandlers.name('parameter')

      expect(socket.emit).toHaveBeenCalledWith('throw', 'error message')
    })
  })
  describe('longReplyOn', () => {
    it('should register handler to reply with progress', async () => {
      expect(replier.longReplyOn('name', 'naming', 'named', async (notify, parameter) => {
        expect(parameter).toBe('parameter')
        notify('notification')
        return 'reply'
      })).toBe(replier)

      await socketOnHandlers.name('parameter')

      expect(info).toHaveBeenCalledWith('notification')
      expect(server.emit).toHaveBeenCalledWith('naming')
      expect(server.emit).toHaveBeenCalledWith('message', 'notification')
      expect(server.emit).toHaveBeenCalledWith('named')
    })
    it('should register handler to emit "throw" when reply with progress throws', async () => {
      expect(replier.longReplyOn('name', 'naming', 'named', async (notify, parameter) => {
        expect(parameter).toBe('parameter')
        notify('notification')
        throw error
      })).toBe(replier)

      await socketOnHandlers.name('parameter')

      expect(server.emit).toHaveBeenCalledWith('naming')
      expect(server.emit).toHaveBeenCalledWith('message', 'notification')
      expect(server.emit).toHaveBeenCalledWith('throw', 'error message')
    })
  })
})
