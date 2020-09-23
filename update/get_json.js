'use strict'

const { getStream } = require('./get_stream')

exports.getJson = async url => {
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
