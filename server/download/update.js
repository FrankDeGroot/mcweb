'use strict'

const { rename } = require('fs').promises
const { getLatest } = require('./get_latest')
const {
  getPathCurrentServer,
  isCurrentLatest,
  downloadLatest,
  restartIfNeeded
} = require('./update_steps')

exports.update = async ({ version }, notify) => {
  notify(`Updating ${version}`)
  const serverInfo = await getLatest(version)
  const pathCurrent = getPathCurrentServer(version, serverInfo)
  if (await isCurrentLatest(pathCurrent, serverInfo)) {
    notify(`Current ${version} is already ${serverInfo.latest}`)
    return
  }
  notify(`Downloading ${version} ${serverInfo.latest}`)
  const pathLatest = await downloadLatest(version, serverInfo)
  await restartIfNeeded(version, serverInfo.latest, notify, async () => {
    notify('Replacing server.jar')
    await rename(pathLatest, pathCurrent)
  })
}
