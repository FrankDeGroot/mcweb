'use strict'

jest.mock('fs')
jest.mock('./../mcpaths')
jest.mock('./get_stream')
jest.mock('./get_sha1')
jest.mock('./pipe')

const { createReadStream, createWriteStream, promises } = require('fs')
const { unlink } = promises
const { versionPath } = require('./../mcpaths')
const { getStream } = require('./get_stream')
const { getSha1 } = require('./get_sha1')
const { pipe } = require('./pipe')

const { pathCurrentServer, currentIsLatest, downloadLatest } = require('./update_steps')

const serverInfo = {
  latest: '1.2.3',
  url: 'url',
  sha1: 'sha1'
}
const readStream = {}
const gottenStream = {}
const writtenStream = {}

function commonMockSetup () {
  versionPath.mockReset().mockReturnValue('versionPath')
  getSha1.mockReset().mockResolvedValue('sha1')
  createReadStream.mockReset().mockReturnValue(readStream)
  getStream.mockReset().mockResolvedValue(gottenStream)
  createWriteStream.mockReset().mockReturnValue(writtenStream)
}

describe('pathCurrentServer', () => {
  beforeEach(() => {
    commonMockSetup()
  })
  it('should return path of current server jar', () => {
    expect(pathCurrentServer('release', serverInfo)).toBe('versionPath/server.jar')

    expect(versionPath).toHaveBeenCalledWith('release')
  })
})

describe('currentIsLatest', () => {
  beforeEach(() => {
    commonMockSetup()
  })
  it('should return true when current and latest match SHA1', async () => {
    createReadStream.mockReturnValue(readStream)

    expect(currentIsLatest('currentPath', serverInfo)).resolves.toEqual(true)

    expect(createReadStream).toHaveBeenCalledWith('currentPath')
    expect(getSha1).toHaveBeenCalledWith(readStream)
  })
  it('should return false when current SHA1 does not match latest', async () => {
    getSha1.mockResolvedValue('otherSha1')

    expect(currentIsLatest('currentPath', serverInfo)).resolves.toEqual(false)

    expect(createReadStream).toHaveBeenCalledWith('currentPath')
    expect(getSha1).toHaveBeenCalledWith(readStream)
  })
})

describe('downloadLatest', () => {
  beforeEach(() => {
    commonMockSetup()
  })
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
