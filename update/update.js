'use strict'

const { rename } = require('fs').promises
const { getLatest } = require('./get_latest')
const { currentVersion } = require('./../mcget')
const { restart } = require('./../restart')
const { pathCurrentServer, currentIsLatest, downloadLatest } = require('./update_steps')

exports.update = async (version, notify) => {
  notify(`Updating ${version}`)
  const serverInfo = await getLatest(version)
  const pathCurrent = pathCurrentServer(version, serverInfo)
  if (await currentIsLatest(pathCurrent, serverInfo)) {
    notify(`Current ${version} is already ${serverInfo.latest}`)
    return
  }
  notify(`Downloading ${version} ${serverInfo.latest}`)
  const pathLatest = downloadLatest(version, serverInfo)
  await safeReplace(version, serverInfo.latest, notify, async () => {
    notify('Replacing server.jar')
    await rename(pathLatest, pathCurrent)
  })
}

async function safeReplace (version, latest, notify, reconfigure) {
  if (version === await currentVersion()) {
    restart(`Upgrading to ${latest}`, notify, reconfigure)
  } else {
    await reconfigure()
  }
}
