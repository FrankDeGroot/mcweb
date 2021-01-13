'use strict'

jest.mock('https')
jest.mock('crypto')

const { getStream } = require('./get_stream')

describe('getStream', () => {
  const { get } = require('https')
  beforeEach(() => {
    get.mockReset()
  })
  it('should resolve on status code 200', async () => {
    const response = {
      statusCode: 200
    }
    get.mockImplementation((url, cb) => cb(response))

    await expect(getStream('some url')).resolves.toBe(response)
  })
  it('should reject on another status code', async () => {
    const response = {
      statusCode: 304
    }
    get.mockImplementation((url, cb) => cb(response))

    expect(() => getStream('some url')).rejects.toEqual(new Error('GET some url returned 304'))
  })
  it('should reject on throwing get', async () => {
    const error = new Error()
    get.mockImplementation(() => {
      throw error
    })

    expect(() => getStream('some url')).rejects.toEqual(error)
  })
})
