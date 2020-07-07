'use strict'

jest.mock('fs')

const { readFile } = require('fs').promises
const { readServerProperties } = require('./mcproperties')

test('readServerProperties', async () => {
	readFile.mockResolvedValue('#notaproperty\nproperty1=value\nproperty2=value=value')
  expect(await readServerProperties()).toStrictEqual({
  	property1: 'value',
  	property2: 'value=value'
  })
	expect(readFile.mock.calls[0][0]).toBe('../server/common/server.properties')
	expect(readFile.mock.calls[0][1]).toBe('utf8')
})
