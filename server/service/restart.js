'use strict'

const { start, stop } = require('./service')
const { say } = require('./say')
const { sleep } = require('../utils/sleep')

exports.restart = async (reason, notify, reconfigure) => {
  notify('Send warning to players and wait')
  await say(`${reason} in 2 seconds.`)
  await sleep(2000)
  notify('Stopping Minecraft')
  await stop()
  notify('Reconfiguring')
  reconfigure()
  notify('Starting Minecraft')
  await start()
  notify('Waiting for Minecraft')
  await say('Welcome back!')
  notify('Done')
}
