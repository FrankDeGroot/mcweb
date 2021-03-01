'use strict'

const { connect, send } = require('../service/rcon')
const { getGamerulesDefinitions } = require('./list_gamerules')

exports.getGamerules = async () => {
  await connect()
  const pendingValues = Object.entries(getGamerulesDefinitions())
    .map(async ([key, definition]) => await getGamerule(key, definition))
  const fulfilledValues = await Promise.all(pendingValues)
  return fulfilledValues
    .filter(gamerule => gamerule !== null)
    .reduce((gamerules, gamerule) => ({ ...gamerules, ...gamerule }), {})
}

exports.setGamerules = async (gamerules, notify) => {
  await Promise.all(Object.entries(gamerules).map(async ([key, { value }]) => {
    notify(await send(`gamerule ${key} ${value}`))
  }))
}

async function getGamerule (gamerule, definition) {
  const response = await send('gamerule ' + gamerule)
  const separatorIndex = response.indexOf(': ')
  if (separatorIndex !== -1) {
    const value = parse(response.substring(separatorIndex + 2), definition.type)
    definition.value = value
  }
  return {
    [gamerule]: definition
  }
}

function parse (value, type) {
  switch (type) {
    case 'boolean': return JSON.parse(value)
    case 'integer': return parseInt(value, 10)
    default: throw new Error(`Unknown gamerule type '${type}'.`)
  }
}
