'use strict'

const {
  getCurrentVersionPath,
  getCurrentWorldPath,
  serverPath,
  versionPath,
  worldPath
} = require('./paths')

test('getCurrentVersionPath', () => {
  expect(getCurrentVersionPath()).toBe('../test/server/current')
})

test('getCurrentWorldPath', () => {
  expect(getCurrentWorldPath('someVersion')).toBe('../test/server/someVersion/world')
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
