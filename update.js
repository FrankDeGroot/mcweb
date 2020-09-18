'use strict'

const { createReadStream, createWriteStream, promises } = require('fs')
const { rename, unlink } = promises
const { join } = require('path')
const { versionPath } = require('./mcpaths')
const { currentVersion } = require('./mcget')
const { restart } = require('./restart')
const { getJson, getSha1, getStream, pipe } = require('./download')

exports.update = async (version, notify) => {
  notify(`Updating ${version}`)
  const serverInfo = await latestServerInfo(version)

  const pathCurrentServer = join(versionPath(version), 'server.jar')
  if (hasSha1(pathCurrentServer, serverInfo.sha1)) {
    notify(`Current ${version} is already ${serverInfo.latest}`)
    return
  }
  notify(`Downloading ${version} ${serverInfo.latest}`)
  const pathLatestServer = join(versionPath(version), `server.${serverInfo.latest}.jar`)
  await pipe(await getStream(serverInfo.url), createWriteStream(pathLatestServer))
  if (!hasSha1(pathLatestServer, serverInfo.sha1)) {
    await unlink(pathLatestServer)
    throw new Error(`Latest ${version} ${serverInfo.latest} download failed`)
  }
  await safeReplace(version, serverInfo.latest, notify, async () => {
    notify('Replacing server.jar')
    await rename(pathLatestServer, pathCurrentServer)
  })
}

async function hasSha1 (path, sha1) {
  return sha1 === await getSha1(createReadStream(path))
}

async function latestServerInfo (version) {
  const history = await getJson('https://launchermeta.mojang.com/mc/game/version_manifest.json')
  const latest = history.latest[version]
  const versionInfoUrl = history.versions.find(entry => entry.id === latest).url
  const versionInfo = await getJson(versionInfoUrl)
  const { sha1, url } = versionInfo.downloads.server
  return { latest, sha1, url }
}

async function safeReplace (version, latest, notify, reconfigure) {
  if (version === await currentVersion()) {
    restart(`Upgrading to ${latest}`, notify, reconfigure)
  } else {
    await reconfigure()
  }
}
