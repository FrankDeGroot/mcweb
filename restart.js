'use strict'

const { start, stop } = require('./mcservice')
const { say } = require('./mcrcon')
const { sleep } = require('./sleep')

let restarting = false

exports.restart = async (reason, notify, reconfigure) => {
  if (restarting) {
    throw new Error('Already restarting')
  }
  try {
    restarting = true
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
  } finally {
    restarting = false
  }
}
