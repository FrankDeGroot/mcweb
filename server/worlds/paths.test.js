'use strict'

const {
  currentVersionPath,
  currentWorldPath,
  serverPath,
  versionPath,
  worldPath
} = require('./paths')

test('currentVersionPath', () => {
  expect(currentVersionPath()).toBe('../test/server/current')
})

test('currentWorldPath', () => {
  expect(currentWorldPath('someVersion')).toBe('../test/server/someVersion/world')
})

test('serverPath', () => {
  expect(serverPath()).toBe('../test/server')
})

test('versionPath', () => {
  expect(versionPath('someVersion')).toBe('../test/server/someVersion')
})

test('worldPath', () => {
  expect(worldPath('someVersion', 'someWorld')).toBe('../test/server/someVersion/someWorld')
})
