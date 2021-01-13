'use strict'

const { readFile, writeFile } = require('fs').promises
const { join } = require('path')

const { getCommonPath } = require('./paths')

exports.readServerProperties = async () => {
  const serverProperties = await readFile(serverPropertiesFileName(), 'utf8')
  return serverProperties.split(/[\r\n]+/)
    .filter(line => line && !line.startsWith('#'))
    .reduce((acc, line) => {
      const [key, ...value] = line.split(/=/)
      acc[key] = value.join('=')
      return acc
    }, {})
}

exports.writeServerProperties = async serverProperties => {
  await writeFile(serverPropertiesFileName(), Object.entries(serverProperties).sort()
    .map(([key, value]) => `${key}=${value}`)
    .join('\n'), 'utf8')
}

function serverPropertiesFileName () {
  return join(getCommonPath(), 'server.properties')
}
