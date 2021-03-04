'use strict'

const { Rcon: { connect } } = require('rcon-client')
const { readServerProperties } = require('../worlds/serverproperties')
const { cache } = require('../utils/cache')

const connectionCache = cache()

exports.connect = async () => {
  await connectionCache.store(async () => {
    const { 'rcon.port': port, 'rcon.password': password } = await readServerProperties()
    return await connect({ host: 'localhost', port, password })
  })
}

exports.send = async request => {
  const connection = connectionCache.read(() => {
    throw new Error('Not connected')
  })
  try {
    return await connection.send(request)
  } catch (error) {
    connectionCache.evict()
    throw error
  }
}
