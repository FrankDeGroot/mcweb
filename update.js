'use strict'

const { get } = require('https')
const { createHash } = require('crypto')
const { createReadStream, createWriteStream, promises } = require('fs')
const { rename, unlink } = promises
const { join } = require('path')
const { versionPath } = require('./mcpaths')
const { currentVersion } = require('./mcget')
const { restart } = require('./restart')

exports.update = async (version, notify) => {
  notify(`Updating ${version}`)
  const history = await getJson('https://launchermeta.mojang.com/mc/game/version_manifest.json')
  const latest = history.latest[version]
  const versionInfoUrl = history.versions.find(entry => entry.id === latest).url
  const versionInfo = await getJson(versionInfoUrl)
  const serverInfo = versionInfo.downloads.server
  const serverSha1 = serverInfo.sha1

  const pathCurrentServer = join(versionPath(version), 'server.jar')
  if (serverSha1 === await getSha1(pathCurrentServer)) {
    notify(`Current ${version} is already ${latest}`)
    return
  } else {
    notify(`Upgrading ${version} to ${latest}`)
  }

  const serverUrl = serverInfo.url
  notify(`Downloading ${version} ${latest}`)
  const pathLatestServer = join(versionPath(version), `server.${latest}.jar`)
  await pipe(await getStream(serverUrl), createWriteStream(pathLatestServer))
  if (serverSha1 !== await getSha1(pathLatestServer)) {
    await unlink(pathLatestServer)
    throw new Error(`Latest ${version} ${latest} download sha1 does not match`)
  }
  await safeReplace(version, latest, notify, async () => {
    notify('Replacing server.jar')
    await rename(pathLatestServer, pathCurrentServer)
  })
}

async function safeReplace (version, latest, notify, reconfigure) {
  if (version === await currentVersion()) {
    restart(`Upgrading to ${latest}`, notify, reconfigure)
  } else {
    await reconfigure()
  }
}

async function getJson (url) {
  const buffer = await getBuffer(url)
  return JSON.parse(buffer.toString())
}

async function getBuffer (url) {
  const res = await getStream(url)
  return new Promise((resolve, reject) => {
    const chunks = []
    res
      .on('data', chunk => {
        chunks.push(chunk)
      })
      .on('end', () => resolve(Buffer.concat(chunks)))
      .on('error', err => reject(err))
  })
}

async function getStream (url) {
  return new Promise((resolve, reject) => {
    get(url, res => {
      if (res.statusCode === 200) {
        resolve(res)
      } else {
        reject(new Error(`GET ${url} returned ${res.statusCode}.`))
      }
    })
  })
}

async function pipe (from, to) {
  return new Promise((resolve, reject) => {
    from
      .pipe(to)
      .on('finish', () => resolve())
      .on('error', err => reject(err))
  })
}

async function getSha1 (path) {
  const hash = createHash('sha1')
  await pipe(createReadStream(path), hash)
  return hash.digest('hex')
}
