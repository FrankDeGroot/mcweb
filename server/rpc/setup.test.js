'use strict'

jest.mock('./replier')
jest.mock('./calls')

const { Replier } = require('./replier')
const {
  current,
  change,
  update
} = require('./calls')

const { setup } = require('./setup')

const replier = {
  replyOn: jest.fn(),
  longReplyOn: jest.fn()
}
Replier.mockReturnValue(replier)
replier.replyOn.mockImplementation(() => replier)
replier.longReplyOn.mockImplementation(() => replier)

const socket = {}
const server = {}

describe('setup', () => {
  it('should setup calls', () => {
    setup(socket, server)

    expect(Replier).toHaveBeenCalledWith(socket, server)
    expect(replier.replyOn).toHaveBeenCalledWith('current', current)
    expect(replier.longReplyOn).toHaveBeenCalledWith('change', 'changing', 'changed', change)
    expect(replier.longReplyOn).toHaveBeenCalledWith('update', 'updating', 'updated', update)
  })
})
