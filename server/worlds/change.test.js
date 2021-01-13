'use strict'

jest.mock('fs')
jest.mock('./paths')
jest.mock('./read')
jest.mock('../service/restart')

const { symlink, unlink } = require('fs').promises
const {
  getCurrentVersionPath,
  currentWorldPath,
  versionPath
} = require('./paths')
const {
  currentVersion,
  currentWorld
} = require('./read')
const { restart } = require('../service/restart')

const notify = jest.fn()

const { change } = require('./change')

describe('change', () => {
  beforeAll(() => {
    symlink.mockReset()
    unlink.mockReset()
    getCurrentVersionPath.mockReset()
    currentWorldPath.mockReset()
    versionPath.mockReset()
    currentVersion.mockReset()
    currentWorld.mockReset()
    restart.mockReset()
  })
  it('should change version and world', async () => {
    currentVersion.mockResolvedValue('oldVersion')
    currentWorld.mockResolvedValue('newVersion')
    getCurrentVersionPath.mockReturnValue('getCurrentVersionPath')
    currentWorldPath.mockReturnValue('currentWorldPath')
    restart.mockImplementation((reason, notify, reconfigure) => reconfigure())

    await change('newVersion', 'newWorld', notify)

    expect(unlink).toHaveBeenCalledWith('getCurrentVersionPath')
    expect(symlink).toHaveBeenCalledWith('newVersion', 'getCurrentVersionPath')

    expect(currentWorldPath).toHaveBeenCalledWith('newVersion')
    expect(unlink).toHaveBeenCalledWith('currentWorldPath')
    expect(symlink).toHaveBeenCalledWith('newWorld', 'currentWorldPath')
  })
  it('should skip when version and world are already current', async () => {
    const VERSION = 'Version'
    const WORLD = 'World'

    currentVersion.mockResolvedValue(VERSION)
    currentWorld.mockResolvedValue(WORLD)

    await change(VERSION, WORLD, notify)

    expect(notify).toHaveBeenCalledWith('Already current')
  })
})
