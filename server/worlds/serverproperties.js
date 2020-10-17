'use strict'

const { readFile, writeFile } = require('fs').promises
const { join } = require('path')

const { serverPath } = require('./paths')

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
  await writeFile(serverPropertiesFileName(), Object.keys(serverProperties).sort()
    .map(key => `${key}=${serverProperties[key]}`)
    .join('\n'), 'utf-8')
}

function serverPropertiesFileName () {
  return join(serverPath(), 'common', 'server.properties')
}
