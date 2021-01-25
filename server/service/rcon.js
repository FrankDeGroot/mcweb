'use strict'

const Rcon = require('rcon')
const { info } = require('../utils/log')
const { readServerProperties } = require('../worlds/serverproperties')

exports.send = async message => {
  const serverProperties = await readServerProperties()
  return new Promise((resolve, reject) => {
    let response = null
    const con = new Rcon('localhost',
      serverProperties['rcon.port'],
      serverProperties['rcon.password'], {
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
