'use strict'

const {
  getCurrentVersionPath,
  getCurrentWorldPath,
  getServerPath,
  getVersionPath,
  getWorldPath
} = require('./paths')

test('getCurrentVersionPath', () => {
  expect(getCurrentVersionPath()).toBe('../test/server/current')
})

test('getCurrentWorldPath', () => {
  expect(getCurrentWorldPath('someVersion')).toBe('../test/server/someVersion/world')
})

test('getServerPath', () => {
  expect(getServerPath()).toBe('../test/server')
})

test('getVersionPath', () => {
  expect(getVersionPath('someVersion')).toBe('../test/server/someVersion')
})

test('getWorldPath', () => {
  expect(getWorldPath('someVersion', 'someWorld')).toBe('../test/server/someVersion/someWorld')
})
