'use strict'

const { Rcon: { connect } } = require('rcon-client')
const { readServerProperties } = require('../worlds/serverproperties')
const { deleteCachedItem, getCachedItem, setCachedItem } = require('../utils/cache')

const connection = 'connection'

exports.connect = async () => {
  if (!getCachedItem(connection)) {
    const { 'rcon.port': port, 'rcon.password': password } = await readServerProperties()
    setCachedItem(connection, await connect({ host: 'localhost', port, password }))
  }
}

exports.send = async request => {
  if (!getCachedItem(connection)) {
    throw new Error('Not connected')
  }
  try {
    return await getCachedItem(connection).send(request)
  } catch (error) {
    deleteCachedItem(connection)
    throw error
  }
}
