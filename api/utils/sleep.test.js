'use strict'

const { sleep } = require('./sleep')

describe('sleep', () => {
  beforeEach(() => {
    jest.useFakeTimers('legacy')
  })
  it('should return Promise that resolves after timeout', () => {
    sleep(1000)

    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000)
  })
})
