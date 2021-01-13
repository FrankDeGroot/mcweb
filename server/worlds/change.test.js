'use strict'

jest.mock('fs')
jest.mock('./paths')
jest.mock('./read')
jest.mock('../service/restart')

const { symlink, unlink } = require('fs').promises
const {
  getCurrentVersionPath,
  getCurrentWorldPath,
  getVersionPath
} = require('./paths')
const {
  getCurrentVersion,
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
    getCurrentWorldPath.mockReset()
    getVersionPath.mockReset()
    getCurrentVersion.mockReset()
    currentWorld.mockReset()
    restart.mockReset()
  })
  it('should change version and world', async () => {
    getCurrentVersion.mockResolvedValue('oldVersion')
    currentWorld.mockResolvedValue('newVersion')
    getCurrentVersionPath.mockReturnValue('getCurrentVersionPath')
    getCurrentWorldPath.mockReturnValue('getCurrentWorldPath')
    restart.mockImplementation((reason, notify, reconfigure) => reconfigure())

    await change('newVersion', 'newWorld', notify)

    expect(unlink).toHaveBeenCalledWith('getCurrentVersionPath')
    expect(symlink).toHaveBeenCalledWith('newVersion', 'getCurrentVersionPath')

    expect(getCurrentWorldPath).toHaveBeenCalledWith('newVersion')
    expect(unlink).toHaveBeenCalledWith('getCurrentWorldPath')
    expect(symlink).toHaveBeenCalledWith('newWorld', 'getCurrentWorldPath')
  })
  it('should skip when version and world are already current', async () => {
    const VERSION = 'Version'
    const WORLD = 'World'

    getCurrentVersion.mockResolvedValue(VERSION)
    currentWorld.mockResolvedValue(WORLD)

    await change(VERSION, WORLD, notify)

    expect(notify).toHaveBeenCalledWith('Already current')
  })
})
