'use strict'

exports.cache = () => {
  let storage = null
  return {
    store: async create => {
      return storage || (storage = await create())
    },
    read: otherwise => storage || otherwise(),
    evict: () => {
      storage = null
    }
  }
}
