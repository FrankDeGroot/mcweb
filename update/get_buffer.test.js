'use strict'

jest.mock('./get_stream')

const { getStream } = require('./get_stream')

const { getBuffer } = require('./get_buffer')

describe('getBuffer', () => {
  const buffer1 = Buffer.from('{ "a"', 'utf-8')
  const buffer2 = Buffer.from(': "b" }', 'utf-8')
  const url = 'some url'
  const lastRegisteredEvent = 'error'
  let fireEvents
  beforeEach(() => {
    const response = {
      on: jest.fn()
    }

    const responseHandlers = {}

    response.on.mockImplementation((event, handler) => {
      responseHandlers[event] = handler
      if (event === lastRegisteredEvent) {
        setImmediate(() => fireEvents(responseHandlers))
      }
      return response
    })

    getStream.mockResolvedValue(response)
  })
  it('should concatenate received buffers', async () => {
    fireEvents = handlers => {
      handlers.data(buffer1)
      handlers.data(buffer2)
      handlers.end()
    }
    await expect(getBuffer(url)).resolves.toEqual(Buffer.from('{ "a": "b" }', 'utf-8'))
    expect(getStream).toHaveBeenCalledWith(url)
  })
  it('should reject on error', async () => {
    const error = new Error()
    fireEvents = handlers => {
      handlers.error(error)
    }
    await expect(getBuffer(url)).rejects.toEqual(error)
  })
})
