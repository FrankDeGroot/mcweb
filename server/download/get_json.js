'use strict'

const { getBuffer } = require('./get_buffer')

exports.getJson = async url => {
  const buffer = await getBuffer(url)
  return JSON.parse(buffer.toString())
}
