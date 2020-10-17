'use strict'

jest.mock('./service')
jest.mock('./rcon')
jest.mock('../utils/sleep')

const { start, stop } = require('./service')
const { say } = require('./rcon')
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
  it('should skip when already restarting', async () => {
    say.mockImplementationOnce(async () => {
      await expect(() =>
        restart('some reason 2', notify, reconfigure)
          .rejects.toStrictEqual(new Error('Already restarting')))
    })

    await restart('some reason 1', notify, reconfigure)

    expect(stop.mock.calls.length).toBe(1)
    expect(reconfigure.mock.calls.length).toBe(1)
    expect(start.mock.calls.length).toBe(1)
  })
  it('should not skip when changing fails', async () => {
    const ERR = new Error()
    notify.mockImplementationOnce(() => {
      throw ERR
    })

    await expect(() => restart('some reason 1', notify, reconfigure)).rejects.toBe(ERR)
    await restart('some reason 2', notify, reconfigure)
  })
})
