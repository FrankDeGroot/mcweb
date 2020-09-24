'use strict'

jest.mock('./get_buffer')

const { getBuffer } = require('./get_buffer')

const { getJson } = require('./get_json')

getBuffer.mockResolvedValue(Buffer.from('{ "a": "b" }', 'utf-8'))

const url = 'some url'

describe('getJson', () => {
  it('should download JSON when receiving response', async () => {
    await expect(getJson(url)).resolves.toEqual({ a: 'b' })
    expect(getBuffer).toHaveBeenCalledWith(url)
  })
})
