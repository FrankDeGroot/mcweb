'use strict'

const { cache } = require('./cache')

describe('cache', () => {
  it('should store, read and evict', async () => {
    const myCache = cache()
    const value = 'value'

    const create = jest.fn()
    create.mockResolvedValue(value)
    await expect(myCache.store(create)).resolves.toBe(value)
    await expect(myCache.store(create)).resolves.toBe(value)

    expect(create).toHaveBeenCalledTimes(1)

    const otherwise = jest.fn()
    expect(myCache.read(otherwise)).toBe(value)

    myCache.evict()

    otherwise.mockImplementation(() => {
      throw new Error('no value')
    })
    expect(() => myCache.read(otherwise)).toThrow(new Error('no value'))

    await expect(myCache.store(create)).resolves.toBe(value)

    expect(create).toHaveBeenCalledTimes(2)
  })
})
