'use strict'

const { readServerProperties, writeServerProperties } = require('./mcproperties.js')

exports.create = async (seed, notify) => {
  const serverProperties = await readServerProperties()
  serverProperties['level-seed'] = seed
  await writeServerProperties(serverProperties)
}
