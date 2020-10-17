'use strict'

const { pipe } = require('./pipe')

describe('pipe', () => {
  const from = {
    pipe: jest.fn(),
    on: jest.fn()
  }
  const to = {}
  const fromHandlers = {}
  beforeEach(() => {
    from.pipe.mockReturnValue(from)
    from.on.mockImplementation((event, handler) => {
      fromHandlers[event] = handler
      return from
    })
  })
  it('should resolve on finish event', async () => {
    const promise = pipe(from, to)
    fromHandlers.finish()
    expect(promise).resolves.toBe(undefined)
  })
  it('should reject on error event', async () => {
    const promise = pipe(from, to)
    const error = new Error()
    fromHandlers.error(error)
    expect(promise).rejects.toBe(error)
  })
})
