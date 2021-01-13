'use strict'

jest.mock('fs')

const { access, lstat, readdir, readlink } = require('fs').promises
const { getCurrentVersion, currentWorld, versions, worlds } = require('./read')

const CURRENT = 'current'

describe('getCurrentVersion', () => {
  beforeEach(() => {
    readlink.mockReset()
  })
  it('reads current', async () => {
    readlink.mockResolvedValue(CURRENT)
    expect(await getCurrentVersion()).toBe(CURRENT)
    expect(readlink.mock.calls[0][0]).toBe('../test/server/current')
  })
  it('throws notFound if path does not exist', async () => {
    readlink.mockRejectedValue({ code: 'ENOENT' })
    await expect(getCurrentVersion).rejects.toEqual(new Error('Unknown path \'../test/server/current\''))
  })
})

describe('currentWorld', () => {
  beforeEach(() => {
    readlink.mockReset()
  })
  it('reads current', async () => {
    readlink.mockResolvedValue(CURRENT)
    expect(await currentWorld('version')).toBe(CURRENT)
    expect(readlink.mock.calls[0][0]).toBe('../test/server/version/world')
  })
  it('throws notFound if path does not exist', async () => {
    readlink.mockRejectedValue({ code: 'ENOENT' })
    await expect(() => currentWorld('version')).rejects.toEqual(new Error('Unknown path \'../test/server/version/world\''))
  })
})

describe('versions', () => {
  beforeEach(() => {
    access.mockReset()
    lstat.mockReset()
    readdir.mockReset()
  })
  it('throws on unknown path', async () => {
    readdir.mockRejectedValue({ code: 'ENOENT' })

    await expect(versions).rejects.toStrictEqual(new Error('Unknown path \'../test/server\''))
  })
  it('reads versions', async () => {
    access
      .mockResolvedValueOnce()
      .mockRejectedValueOnce({ code: 'ENOENT' })
      .mockResolvedValueOnce()
    lstat
      .mockResolvedValueOnce({
        isDirectory: () => true
      })
      .mockResolvedValueOnce({
        isDirectory: () => true
      })
      .mockResolvedValueOnce({
        isDirectory: () => true
      })
      .mockResolvedValueOnce({
        isDirectory: () => false
      })
    readdir.mockResolvedValue(['version1', 'notVersion', 'version2', 'notDirectory'])

    expect(await versions()).toStrictEqual(['version1', 'version2'])

    expect(access.mock.calls[0][0]).toBe('../test/server/version1/server.jar')
    expect(access.mock.calls[1][0]).toBe('../test/server/notVersion/server.jar')
    expect(access.mock.calls[2][0]).toBe('../test/server/version2/server.jar')

    expect(lstat.mock.calls[0][0]).toBe('../test/server/version1')
    expect(lstat.mock.calls[1][0]).toBe('../test/server/notVersion')
    expect(lstat.mock.calls[2][0]).toBe('../test/server/version2')
    expect(lstat.mock.calls[3][0]).toBe('../test/server/notDirectory')

    expect(readdir.mock.calls[0][0]).toBe('../test/server')
  })
})

describe('worlds', () => {
  beforeEach(() => {
    access.mockReset()
    lstat.mockReset()
    readdir.mockReset()
  })
  it('throws on unknown path', async () => {
    readdir.mockRejectedValue({ code: 'ENOENT' })

    await expect(() => worlds('version')).rejects.toStrictEqual(new Error('Unknown path \'../test/server/version\''))
  })
  it('reads worlds', async () => {
    access
      .mockResolvedValueOnce()
      .mockRejectedValueOnce({ code: 'ENOENT' })
      .mockResolvedValueOnce()
    lstat
      .mockResolvedValueOnce({
        isDirectory: () => true
      })
      .mockResolvedValueOnce({
        isDirectory: () => true
      })
      .mockResolvedValueOnce({
        isDirectory: () => true
      })
      .mockResolvedValueOnce({
        isDirectory: () => false
      })
    readdir.mockResolvedValue(['world1', 'notWorld', 'world2', 'notDirectory'])

    expect(await worlds('version')).toStrictEqual(['world1', 'world2'])

    expect(access.mock.calls[0][0]).toBe('../test/server/version/world1/level.dat')
    expect(access.mock.calls[1][0]).toBe('../test/server/version/notWorld/level.dat')
    expect(access.mock.calls[2][0]).toBe('../test/server/version/world2/level.dat')

    expect(lstat.mock.calls[0][0]).toBe('../test/server/version/world1')
    expect(lstat.mock.calls[1][0]).toBe('../test/server/version/notWorld')
    expect(lstat.mock.calls[2][0]).toBe('../test/server/version/world2')
    expect(lstat.mock.calls[3][0]).toBe('../test/server/version/notDirectory')

    expect(readdir.mock.calls[0][0]).toBe('../test/server/version')
  })
})
