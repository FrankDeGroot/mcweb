'use strict'

jest.mock('fs')

const { readFile, writeFile } = require('fs').promises
const { readServerProperties, writeServerProperties } = require('./serverproperties')

test('readServerProperties', async () => {
  readFile.mockResolvedValue('#notaproperty\nproperty1=value\nproperty2=value=value')
  expect(await readServerProperties()).toStrictEqual({
    property1: 'value',
    property2: 'value=value'
  })
  expect(readFile.mock.calls[0][0]).toBe('../test/server/common/server.properties')
  expect(readFile.mock.calls[0][1]).toBe('utf8')
})

test('writeServerProperties', async () => {
  await writeServerProperties({
    property2: 'value=value',
    property1: 'value'
  })
  expect(writeFile).toHaveBeenCalledWith('../test/server/common/server.properties', 'property1=value\nproperty2=value=value', 'utf-8')
})
