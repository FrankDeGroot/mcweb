'use strict'

const { deleteCachedItem, getCachedItem, setCachedItem } = require('./cache')

describe('cache', () => {
  const key = 'item'
  const value = 'value'
  it('should cache', () => {
    expect(getCachedItem(key)).toBe(undefined)

    expect(setCachedItem(key, value)).toBe(value)

    expect(getCachedItem(key)).toBe(value)

    deleteCachedItem(key)

    expect(getCachedItem(key)).toBe(undefined)
  })
})
