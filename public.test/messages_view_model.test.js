'use strict'

jest.mock('../public/change_scheduler')

const { ChangeScheduler } = require('../public/change_scheduler')

const { MessagesViewModel } = require('../public/messages_view_model')

const handlers = {
  onChange: jest.fn()
}

const changeScheduler = {
  scheduleChange: jest.fn()
}

describe('MessagesViewModel', () => {
  let messagesViewModel
  beforeEach(() => {
    ChangeScheduler.mockImplementation(handler => {
      expect(handler).toBe(handlers.onChange)
      return changeScheduler
    })
    messagesViewModel = new MessagesViewModel(handlers)
  })
  it('starts with empty messages', () => {
    expect(messagesViewModel.messages.length).toBe(2)
  })
  it('should shift when adding a new message', () => {
    messagesViewModel.pushMessage('message')
    expect(messagesViewModel.messages.length).toBe(2)
    expect(messagesViewModel.messages[0]).toBe('message')
    expect(changeScheduler.scheduleChange).toHaveBeenCalled()
  })
  it('should keep shifting when adding two new messages', () => {
    messagesViewModel.pushMessage('message 1')
    messagesViewModel.pushMessage('message 2')
    expect(messagesViewModel.messages[0]).toBe('message 2')
    expect(messagesViewModel.messages[1]).toBe('message 1')
  })
  it('should add an error', () => {
    messagesViewModel.pushError('error')
    expect(messagesViewModel.messages[0]).toBe('Error: error')
    expect(changeScheduler.scheduleChange).toHaveBeenCalled()
  })
  it('should clear messages', () => {
    messagesViewModel.pushMessage('message 1')
    messagesViewModel.pushMessage('message 2')
    messagesViewModel.clearMessages()
    expect(messagesViewModel.messages).toStrictEqual([' ', ' '])
    expect(changeScheduler.scheduleChange).toHaveBeenCalled()
  })
})
