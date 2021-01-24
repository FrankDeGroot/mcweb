'use strict'

const { send } = require('./rcon')
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
