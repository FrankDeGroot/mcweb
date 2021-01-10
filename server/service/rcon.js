'use strict'

const Rcon = require('rcon')
const { info, trace } = require('../utils/log')
const { sleep } = require('../utils/sleep')

let serverProperties = null

async function readServerProperties () {
  if (!serverProperties) {
    serverProperties = await require('../worlds/serverproperties').readServerProperties()
  }
}

function send (message) {
  return new Promise((resolve, reject) => {
    let response = null
    const con = new Rcon('localhost', serverProperties['rcon.port'], serverProperties['rcon.password'], {
      tcp: true,
      challenge: false
    })
      .on('auth', () => con.send(message))
      .on('end', () => resolve(response))
      .on('error', err => reject(err))
      .on('response', res => {
        if (res) {
          response = res
          info('rcon response', res)
        }
        con.disconnect()
      })
    con.connect()
  })
}

exports.say = async message => {
  await readServerProperties()
  let tries = 0
  let done = false
  let response = null
  info('Saying', message)
  do {
    tries++
    try {
      trace('Saying', message, 'attempt', tries)
      response = await send('say ' + message)
      done = true
      info('Said', message)
    } catch (err) {
      if (err.code === 'ECONNREFUSED') {
        trace('Failed saying', message, 'attempt', tries)
        await sleep(1000)
      } else {
        throw err
      }
    }
  } while (!done && tries < 120)
  if (!done) {
    throw new Error('Server failed to restart')
  }
  return response
}
