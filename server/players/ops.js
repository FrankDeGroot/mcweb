'use strict'

const { common } = require('../worlds/paths')
const { readFile } = require('fs').promises
const { join } = require('path')

exports.operators = async function () {
  const allowed = await readCommonJson('whitelist.json')
  const operators = await readCommonJson('ops.json')
  allowed.forEach(({ uuid, name }) => {
    if (!operators.find(operator => operator.uuid === uuid)) {
      operators.push({
        uuid,
        name,
        bypassesPlayerLimit: false,
        level: 0
      })
    }
  })
  return operators.sort((l, r) => l.name.localeCompare(r.name))
}

async function readCommonJson (file) {
  return JSON.parse(await readFile(join(common(), file)))
}
