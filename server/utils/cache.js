'use strict'

const cache = {}

exports.getCachedItem = key => cache[key]
exports.setCachedItem = (key, value) => {
  cache[key] = value
  return value
}
exports.deleteCachedItem = key => delete cache[key]
