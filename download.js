'use strict'

const { get } = require('https')
const { createHash } = require('crypto')

exports.getJson = async url => {
  const buffer = await getBuffer(url)
  return JSON.parse(buffer.toString())
}
exports.getSha1 = async readableStream => {
  const hash = createHash('sha1')
  await pipe(readableStream, hash)
  return hash.digest('hex')
}
exports.getStream = getStream
exports.pipe = pipe

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

