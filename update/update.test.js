'use strict'

jest.mock('fs')
jest.mock('./get_latest')
jest.mock('./../mcget')
jest.mock('./../restart')
jest.mock('./update_steps')

const { rename } = require('fs').promises
const { getLatest } = require('./get_latest')
const { currentVersion } = require('./../mcget')
const { restart } = require('./../restart')
const { pathCurrentServer, currentIsLatest, downloadLatest } = require('./update_steps')

const { update } = require('./update')

describe('update', () => {
  const version = 'version'
  const notify = jest.fn()
  const serverInfo = {
    latest: 'latest'
  }
  const pathCurrent = 'pathCurrent'
  const pathLatest = 'pathLatest'
  beforeEach(() => {
    rename.mockReset()
    getLatest.mockReset().mockResolvedValue(serverInfo)
    currentVersion.mockReset()
    restart.mockReset()
    pathCurrentServer.mockReset().mockReturnValue(pathCurrent)
    currentIsLatest.mockReset()
    downloadLatest.mockReset().mockReturnValue(pathLatest)
    notify.mockReset()
  })
  it('should not update when already latest', async () => {
    currentIsLatest.mockResolvedValue(true)

    await update(version, notify)

    expect(getLatest).toHaveBeenCalledWith(version)
    expect(pathCurrentServer).toHaveBeenCalledWith(version, serverInfo)
    expect(currentIsLatest).toHaveBeenCalledWith(pathCurrent, serverInfo)
    expect(notify).toHaveBeenCalledWith('Updating version')
    expect(notify).toHaveBeenCalledWith('Current version is already latest')
  })
})
