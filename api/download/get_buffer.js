'use strict'

const { getStream } = require('./get_stream')

exports.getBuffer = async url => {
  const response = await getStream(url)
  return new Promise((resolve, reject) => {
    const chunks = []
    response
      .on('data', chunk => {
        chunks.push(chunk)
      })
      .on('end', () => resolve(Buffer.concat(chunks)))
      .on('error', err => reject(err))
  })
}
