'use strict'

jest.useFakeTimers()

const { Scheduler } = require('../public/scheduler')

const handler = jest.fn()

describe('Scheduler', () => {
  let scheduler
  beforeEach(() => {
    scheduler = new Scheduler(handler)
    handler.mockReset()
    setTimeout.mockReset()
  })
  it('should schedule', () => {
    scheduler.schedule()
    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 0)
    setTimeout.mock.calls[0][0]()
    expect(handler).toHaveBeenCalled()
  })
  it('should schedule only once', () => {
    scheduler.schedule()
    scheduler.schedule()
    expect(setTimeout).toHaveBeenCalledTimes(1)
  })
  it('should schedule again after handler called', () => {
    scheduler.schedule()
    setTimeout.mock.calls[0][0]()
    scheduler.schedule()
    expect(setTimeout).toHaveBeenCalledTimes(2)
  })
})
