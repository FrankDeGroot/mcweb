'use strict'

jest.mock('fs')

const { access, lstat, readdir, readlink } = require('fs').promises
const { currentVersion, currentWorld, versions, worlds } = require('./mcget')

const CURRENT = 'current'

describe('currentVersion', () => {
  beforeEach(() => {
    readlink.mockReset()
  })
  it('reads current', async () => {
    readlink.mockResolvedValue(CURRENT)
    expect(await currentVersion()).toBe(CURRENT)
    expect(readlink.mock.calls[0][0]).toBe('../server/current')
  })
  it('throws notFound if path does not exist', async () => {
    readlink.mockRejectedValue({ code: 'ENOENT' })
    await expect(currentVersion).rejects.toEqual({ code: 'NOTFOUND', message: 'Unknown path' })
  })
})

describe('currentWorld', () => {
  beforeEach(() => {
    readlink.mockReset()
  })
  it('reads current', async () => {
    readlink.mockResolvedValue(CURRENT)
    expect(await currentWorld('version')).toBe(CURRENT)
    expect(readlink.mock.calls[0][0]).toBe('../server/version/world')
  })
  it('throws notFound if path does not exist', async () => {
    readlink.mockRejectedValue({ code: 'ENOENT' })
    await expect(currentWorld('version')).rejects.toEqual({ code: 'NOTFOUND', message: 'Unknown path' })
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

    await expect(versions).rejects.toStrictEqual({ code: 'NOTFOUND', message: 'Unknown path' })
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

    expect(access.mock.calls[0][0]).toBe('../server/version1/server.jar')
    expect(access.mock.calls[1][0]).toBe('../server/notVersion/server.jar')
    expect(access.mock.calls[2][0]).toBe('../server/version2/server.jar')

    expect(lstat.mock.calls[0][0]).toBe('../server/version1')
    expect(lstat.mock.calls[1][0]).toBe('../server/notVersion')
    expect(lstat.mock.calls[2][0]).toBe('../server/version2')
    expect(lstat.mock.calls[3][0]).toBe('../server/notDirectory')

    expect(readdir.mock.calls[0][0]).toBe('../server')
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

    await expect(() => worlds('version')).rejects.toStrictEqual({ code: 'NOTFOUND', message: 'Unknown path' })
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

    expect(access.mock.calls[0][0]).toBe('../server/version/world1/level.dat')
    expect(access.mock.calls[1][0]).toBe('../server/version/notWorld/level.dat')
    expect(access.mock.calls[2][0]).toBe('../server/version/world2/level.dat')

    expect(lstat.mock.calls[0][0]).toBe('../server/version/world1')
    expect(lstat.mock.calls[1][0]).toBe('../server/version/notWorld')
    expect(lstat.mock.calls[2][0]).toBe('../server/version/world2')
    expect(lstat.mock.calls[3][0]).toBe('../server/version/notDirectory')

    expect(readdir.mock.calls[0][0]).toBe('../server/version')
  })
})
