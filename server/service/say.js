'use strict'

const { connect, send } = require('./rcon')
const { info, trace } = require('../utils/log')
const { sleep } = require('../utils/sleep')

exports.say = async message => {
  let tries = 0
  let done = false
  let response = null
  info('Saying', message)
  do {
    tries++
    try {
      trace('Saying', message, 'attempt', tries)
      await connect()
      response = await send('say ' + message)
      done = true
      info('Said', message)
    } catch (error) {
      if (error.code === 'ECONNREFUSED' || error.message === 'Not connected') {
        trace('Failed saying', message, 'attempt', tries)
        await sleep(1000)
      } else {
        throw error
      }
    }
  } while (!done && tries < 120)
  if (!done) {
    throw new Error('Server failed to restart')
  }
  return response
}
