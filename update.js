'use strict'

const https = require('https')
const crypto = require('crypto')
const { createReadStream, createWriteStream } = require('fs')
const { rename } = require('fs').promises
const { join } = require('path')
const { info } = require('./log')
const { versionPath } = require('./mcpaths')
const { start, stop } = require('./mcservice')
const { say } = require('./mcrcon')
const { sleep } = require('./sleep')
const { currentVersion } = require('./mcget')

exports.update = async (version, onchange) => {
  info('updating', version)
  const history = await getJson('https://launchermeta.mojang.com/mc/game/version_manifest.json')
  const latest = history.latest[version]
  info('latest', version, 'is', latest)
  const versionInfoUrl = history.versions.find(entry => entry.id === latest).url
  const versionInfo = await getJson(versionInfoUrl)
  const serverInfo = versionInfo.downloads.server
  const serverSha1 = serverInfo.sha1

  const pathCurrentServer = join(versionPath(version), 'server.jar')
  if (serverSha1 === await (getSha1(pathCurrentServer))) {
    onchange(`Current ${version} is already ${latest}`)
    return
  }

  const serverUrl = serverInfo.url
  onchange(`Downloading ${version} ${latest} at ${serverUrl}`)
  info(`downloading ${version} ${latest} at ${serverUrl}`)
  const pathLatestServer = join(versionPath(version), `server.${latest}.jar`)
  await pipe(await getStream(serverUrl), createWriteStream(pathLatestServer))
  if (serverSha1 !== await getSha1(pathLatestServer)) {
    throw new Error(`Latest ${version} ${latest} download sha1 does not match`)
  }
  await restartIfCurrent(version, latest, async () => {
    onchange('Replacing server')
    info('replacing server.jar')
    await rename(pathLatestServer, pathCurrentServer)
  }, onchange)
  onchange('done')
}

async function restartIfCurrent (version, latest, action, onchange) {
  if (version === await currentVersion()) {
    await say(`Upgrading to ${latest} in 2 s`)
    await sleep(2000)
    onchange('Stopping Minecraft')
    info('stopping mc')
    await stop()

    await action()

    onchange('Starting Minecraft')
    info('starting mc')
    await start()
    onchange('Waiting for Minecraft')
    info('waiting for mc')
    await say('Welcome back!')
  } else {
    await action()
  }
}

async function getJson (url) {
  const buffer = await get(url)
  return JSON.parse(buffer.toString())
}

async function get (url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      const chunks = []
      res
        .on('data', chunk => {
          chunks.push(chunk)
        })
        .on('end', () => resolve(Buffer.concat(chunks)))
        .on('error', err => reject(err))
    })
  })
}

async function getStream (url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
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
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha1')
    createReadStream(path)
      .pipe(hash)
      .on('finish', () => resolve(hash.digest('hex')))
      .on('error', err => reject(err))
  })
}
