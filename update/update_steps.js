'use strict'

const { createReadStream, createWriteStream, promises } = require('fs')
const { unlink } = promises
const { join } = require('path')
const { versionPath } = require('./../mcpaths')
const { getStream } = require('./get_stream')
const { getSha1 } = require('./get_sha1')
const { pipe } = require('./pipe')

exports.compareCurrent = async (version, serverInfo) => {
  const pathCurrent = join(versionPath(version), 'server.jar')
  return {
    pathCurrent,
    alreadyLatest: await hasSha1(pathCurrent, serverInfo.sha1)
  }
}

exports.downloadLatest = async (version, serverInfo) => {
  const pathLatest = join(versionPath(version), `server.${serverInfo.latest}.jar`)
  await pipe(await getStream(serverInfo.url), createWriteStream(pathLatest))
  if (!hasSha1(pathLatest, serverInfo.sha1)) {
    await unlink(pathLatest)
    throw new Error(`Latest ${version} ${serverInfo.latest} download failed`)
  }
  return pathLatest
}

async function hasSha1 (path, sha1) {
  return sha1 === await getSha1(createReadStream(path))
}
