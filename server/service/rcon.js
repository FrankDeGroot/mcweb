'use strict'

const Rcon = require('rcon')
const { readServerProperties } = require('../worlds/serverproperties')

let connection = null

function evictConnection () {
  connection = null
}

async function ensureConnection () {
  return !connection ? createConnection() : Promise.resolve(connection)
}

async function createConnection () {
  const serverProperties = await readServerProperties()
  return new Promise((resolve, reject) => {
    connection = new Rcon('localhost',
      serverProperties['rcon.port'],
      serverProperties['rcon.password'], {
        tcp: true,
        challenge: false
      })
      .on('auth', () => {
        resolve(connection)
      })
      .on('error', error => {
        evictConnection()
        reject(error)
      })
    connection.connect()
  })
}

exports.send = async message => {
  const connection = await ensureConnection()
  return new Promise((resolve, reject) => {
    connection
      .on('error', error => {
        evictConnection()
        reject(error)
      })
      .on('response', response => {
        resolve(response)
      })
      .send(message)
  })
}
