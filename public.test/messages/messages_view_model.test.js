'use strict'

const { MessagesViewModel } = require('../../public/messages/messages_view_model')

const changeScheduler = {
  schedule: jest.fn()
}

describe('MessagesViewModel', () => {
  let messagesViewModel
  beforeEach(() => {
    messagesViewModel = new MessagesViewModel(changeScheduler)
  })
  it('starts with empty messages', () => {
    expect(messagesViewModel.messages.length).toBe(2)
  })
  it('should shift when adding a new message', () => {
    messagesViewModel.pushMessage('message')
    expect(messagesViewModel.messages.length).toBe(2)
    expect(messagesViewModel.messages[0]).toBe('message')
    expect(changeScheduler.schedule).toHaveBeenCalled()
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
    expect(changeScheduler.schedule).toHaveBeenCalled()
  })
  it('should clear messages', () => {
    messagesViewModel.pushMessage('message 1')
    messagesViewModel.pushMessage('message 2')
    messagesViewModel.clearMessages()
    expect(messagesViewModel.messages).toStrictEqual(['\xa0', '\xa0'])
    expect(changeScheduler.schedule).toHaveBeenCalled()
  })
})
