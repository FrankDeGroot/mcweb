'use strict'

jest.mock('fs')
jest.mock('./get_latest')
jest.mock('../worlds/read')
jest.mock('../service/restart')
jest.mock('./update_steps')

const { rename } = require('fs').promises
const { getLatest } = require('./get_latest')
const { getCurrentVersion } = require('../worlds/read')
const { restart } = require('../service/restart')
const {
  getPathCurrentServer,
  isCurrentLatest,
  downloadLatest,
  restartIfNeeded
} = require('./update_steps')

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
    getCurrentVersion.mockReset().mockResolvedValue('version')
    restart.mockReset()
    getPathCurrentServer.mockReset().mockReturnValue(pathCurrent)
    isCurrentLatest.mockReset()
    downloadLatest.mockReset().mockResolvedValue(pathLatest)
    notify.mockReset()
  })
  it('should not update when already latest', async () => {
    isCurrentLatest.mockResolvedValue(true)

    await update(version, notify)

    expect(getLatest).toHaveBeenCalledWith(version)
    expect(getPathCurrentServer).toHaveBeenCalledWith(version, serverInfo)
    expect(isCurrentLatest).toHaveBeenCalledWith(pathCurrent, serverInfo)
    expect(notify).toHaveBeenCalledWith('Updating version')
    expect(notify).toHaveBeenCalledWith('Current version is already latest')
  })
  it('should update when not latest', async () => {
    isCurrentLatest.mockResolvedValue(false)
    restartIfNeeded.mockImplementation(async (v, l, n, reconfigure) => {
      await reconfigure()
    })

    await update(version, notify)

    expect(getLatest).toHaveBeenCalledWith(version)
    expect(getPathCurrentServer).toHaveBeenCalledWith(version, serverInfo)
    expect(isCurrentLatest).toHaveBeenCalledWith(pathCurrent, serverInfo)
    expect(notify).toHaveBeenCalledWith('Updating version')
    expect(notify).toHaveBeenCalledWith('Downloading version latest')
    expect(restartIfNeeded).toHaveBeenCalledWith(version, 'latest', notify, expect.any(Function))
    expect(notify).toHaveBeenCalledWith('Replacing server.jar')
    expect(rename).toHaveBeenCalledWith(pathLatest, pathCurrent)
  })
})
