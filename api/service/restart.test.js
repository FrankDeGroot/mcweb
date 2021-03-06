'use strict'

jest.mock('./service')
jest.mock('./say')
jest.mock('../utils/sleep')

const { start, stop } = require('./service')
const { say } = require('./say')
const { sleep } = require('../utils/sleep')
const notify = jest.fn()
const reconfigure = jest.fn()

const { restart } = require('./restart')

describe('restart', () => {
  beforeEach(() => {
    start.mockReset()
    stop.mockReset()
    say.mockReset()
    sleep.mockReset()
    notify.mockReset()
    reconfigure.mockReset()
  })
  it('should restart', async () => {
    await restart('some reason', notify, reconfigure)

    expect(stop.mock.calls.length).toBe(1)
    expect(notify).toHaveBeenCalled()
    expect(say).toHaveBeenCalled()
    expect(reconfigure.mock.calls.length).toBe(1)
    expect(start.mock.calls.length).toBe(1)
  })
})
