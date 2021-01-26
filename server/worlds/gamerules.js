'use strict'

const { send } = require('../service/rcon')

exports.getGamerules = async () => {
  return {
    ...(await getGamerule('keepInventory', 'boolean'))
  }
}

exports.setGamerules = async (value, notify) => {
  Object.entries(value).forEach(async ([key, value]) => {
    const response = await send(`gamerule ${key} ${value}`)
    notify(response)
  })
}

async function getGamerule (gamerule, type) {
  const response = await send('gamerule ' + gamerule)
  const value = parse(response.substring(response.indexOf(': ') + 2), type)
  return {
    [gamerule]: value
  }
}

function parse (value, type) {
  switch (type) {
    case 'boolean': return JSON.parse(value)
  }
}
