'use strict'

const { common } = require('../worlds/paths')
const { readFile } = require('fs').promises
const { join } = require('path')

exports.operators = async function () {
  return JSON.parse(await readFile(join(common(), 'whitelist.json')))
}