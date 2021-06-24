'use strict'

const { MessagesViewModel } = require('../../web/messages/messages_view_model')

const socket = {
  on: jest.fn()
}
const changeScheduler = {
  schedule: jest.fn()
}

describe('MessagesViewModel', () => {
  let messagesViewModel
  const socketOnHandlers = {}
  beforeEach(() => {
    socket.on.mockImplementation((event, handler) => {
      socketOnHandlers[event] = handler
      return socket
    })
    changeScheduler.schedule.mockReset()
    messagesViewModel = new MessagesViewModel(socket, changeScheduler)
  })
  it('starts with empty messages', () => {
    expect(messagesViewModel.messages.length).toBe(2)
  })
  it('should shift when adding a new message', () => {
    socketOnHandlers.message('message')
    expect(messagesViewModel.messages.length).toBe(2)
    expect(messagesViewModel.messages[0]).toBe('message')
    expect(changeScheduler.schedule).toHaveBeenCalled()
  })
  it('should keep shifting when adding two new messages', () => {
    socketOnHandlers.message('message 1')
    socketOnHandlers.message('message 2')
    expect(messagesViewModel.messages[0]).toBe('message 2')
    expect(messagesViewModel.messages[1]).toBe('message 1')
  })
  it('should add an error', () => {
    socketOnHandlers.throw('error')
    expect(messagesViewModel.messages[0]).toBe('Error: error')
    expect(changeScheduler.schedule).toHaveBeenCalled()
  })
  it('should clear messages', () => {
    socketOnHandlers.message('message 1')
    socketOnHandlers.message('message 2')
    messagesViewModel.clearMessages()
    expect(messagesViewModel.messages).toStrictEqual(['\xa0', '\xa0'])
    expect(changeScheduler.schedule).toHaveBeenCalled()
  })
})
