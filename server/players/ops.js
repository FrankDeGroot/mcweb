'use strict'

const { common } = require('../worlds/paths')
const { readFile, writeFile } = require('fs').promises
const { join } = require('path')
const allowedFilename = join(common(), 'whitelist.json')
const operatorsFilename = join(common(), 'ops.json')

exports.operators = async () => {
  const operators = await readOptionalJson(operatorsFilename)
  const allowed = await readOptionalJson(allowedFilename)
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

exports.saveOperator = async operator => {
  const operators = await readOptionalJson(operatorsFilename)
  await writeFile(operatorsFilename, JSON.stringify(operators.map(op => {
    const updatedOperator = { ...op, ...operator }
    return op.uuid === operator.uuid ? updatedOperator : op
  })))
}

async function readOptionalJson (file) {
  try {
    const json = await readFile(file, 'utf8')
    return JSON.parse(json)
  } catch (e) {
    return e.code === 'ENOENT' ? Promise.resolve([]) : Promise.reject(e)
  }
}
