'use strict'

const { createHash } = require('crypto')
const { pipe } = require('./pipe')

exports.getSha1 = async readableStream => {
  const hash = createHash('sha1')
  await pipe(readableStream, hash)
  return hash.digest('hex')
}
