'use strict'

const {
  currentVersionPath,
  currentWorldPath,
  serverPath,
  versionPath
} = require('./mcpaths')

test('currentVersionPath', () => {
  expect(currentVersionPath()).toBe('../server/current')
})

test('currentWorldPath', () => {
  expect(currentWorldPath('someVersion')).toBe('../server/someVersion/world')
})

test('serverPath', () => {
  expect(serverPath()).toBe('../server')
})

test('versionPath', () => {
  expect(versionPath('someVersion')).toBe('../server/someVersion')
})
