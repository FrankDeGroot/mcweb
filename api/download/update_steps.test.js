'use strict'

jest.mock('fs')
jest.mock('../worlds/paths')
jest.mock('../worlds/read')
jest.mock('../service/restart')
jest.mock('./get_stream')
jest.mock('./get_sha1')
jest.mock('./pipe')

const { createReadStream, createWriteStream, promises } = require('fs')
const { unlink } = promises
const { getVersionPath } = require('../worlds/paths')
const { getCurrentVersion } = require('../worlds/read')
const { restart } = require('../service/restart')
const { getStream } = require('./get_stream')
const { getSha1 } = require('./get_sha1')
const { pipe } = require('./pipe')

const {
  getPathCurrentServer,
  isCurrentLatest,
  downloadLatest,
  restartIfNeeded
} = require('./update_steps')

const serverInfo = {
  latest: '1.2.3',
  url: 'url',
  sha1: 'sha1'
}
const readStream = {}
const gottenStream = {}
const writtenStream = {}

describe('update steps', () => {
  beforeEach(() => {
    getVersionPath.mockReset().mockReturnValue('versionPath')
    getCurrentVersion.mockReset().mockResolvedValue('version')
    restart.mockReset()
    getSha1.mockReset().mockResolvedValue('sha1')
    createReadStream.mockReset().mockReturnValue(readStream)
    getStream.mockReset().mockResolvedValue(gottenStream)
    createWriteStream.mockReset().mockReturnValue(writtenStream)
  })
  describe('getPathCurrentServer', () => {
    it('should return path of current server jar', () => {
      expect(getPathCurrentServer('release', serverInfo)).toBe('versionPath/server.jar')

      expect(getVersionPath).toHaveBeenCalledWith('release')
    })
  })
  describe('isCurrentLatest', () => {
    it('should return true when current and latest match SHA1', async () => {
      createReadStream.mockReturnValue(readStream)

      expect(isCurrentLatest('currentPath', serverInfo)).resolves.toEqual(true)

      expect(createReadStream).toHaveBeenCalledWith('currentPath')
      expect(getSha1).toHaveBeenCalledWith(readStream)
    })
    it('should return false when current SHA1 does not match latest', async () => {
      getSha1.mockResolvedValue('otherSha1')

      expect(isCurrentLatest('currentPath', serverInfo)).resolves.toEqual(false)

      expect(createReadStream).toHaveBeenCalledWith('currentPath')
      expect(getSha1).toHaveBeenCalledWith(readStream)
    })
  })
  describe('downloadLatest', () => {
    it('should download latest and proceed on matching sha1', async () => {
      await expect(downloadLatest('release', serverInfo)).resolves.toEqual('versionPath/server.1.2.3.jar')

      expect(pipe).toHaveBeenCalledWith(gottenStream, writtenStream)
      expect(createReadStream).toHaveBeenCalledWith('versionPath/server.1.2.3.jar')
    })
    it('should throw when latest download does not match sha1', async () => {
      getSha1.mockResolvedValue('otherSha1')

      await expect(downloadLatest('release', serverInfo)).rejects.toEqual(new Error('Latest release 1.2.3 download failed'))

      expect(unlink).toHaveBeenCalledWith('versionPath/server.1.2.3.jar')
    })
  })
  describe('restartIfNeeded', () => {
    const notify = jest.fn()
    const reconfigure = jest.fn()
    beforeEach(() => {
      notify.mockReset()
      reconfigure.mockReset()
    })
    it('should restart if replaced version is current', async () => {
      await restartIfNeeded('version', 'latest', notify, reconfigure)

      expect(restart).toHaveBeenCalledWith('Upgrading to latest', notify, reconfigure)
    })
    it('should not restart if replaced version is not current', async () => {
      await restartIfNeeded('other version', 'latest', notify, reconfigure)

      expect(restart.mock.calls.length).toBe(0)
      expect(reconfigure).toHaveBeenCalled()
    })
  })
})
