'use strict'

const { createReadStream, createWriteStream, promises } = require('fs')
const { unlink } = promises
const { join } = require('path')
const { versionPath } = require('./../mcpaths')
const { currentVersion } = require('./../mcget')
const { restart } = require('./../restart')
const { getStream } = require('./get_stream')
const { getSha1 } = require('./get_sha1')
const { pipe } = require('./pipe')

exports.pathCurrentServer = (version, serverInfo) => {
  return join(versionPath(version), 'server.jar')
}

exports.currentIsLatest = async (pathCurrent, serverInfo) => {
  return await hasSha1(pathCurrent, serverInfo.sha1)
}

exports.downloadLatest = async (version, serverInfo) => {
  const pathLatest = join(versionPath(version), `server.${serverInfo.latest}.jar`)
  await pipe(await getStream(serverInfo.url), createWriteStream(pathLatest))
  if (!await hasSha1(pathLatest, serverInfo.sha1)) {
    await unlink(pathLatest)
    throw new Error(`Latest ${version} ${serverInfo.latest} download failed`)
  }
  return pathLatest
}

exports.restartIfNeeded = async (version, latest, notify, reconfigure) => {
  if (version === await currentVersion()) {
    restart(`Upgrading to ${latest}`, notify, reconfigure)
  } else {
    await reconfigure()
  }
}

async function hasSha1 (path, sha1) {
  return sha1 === await getSha1(createReadStream(path))
}
