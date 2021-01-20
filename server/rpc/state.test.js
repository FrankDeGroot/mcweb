'use strict'

jest.mock('../worlds/read')
jest.mock('../players/operators')
jest.mock('../utils/busy')

const {
  getCurrentVersion,
  getCurrentWorld,
  getVersions,
  getWorlds
} = require('../worlds/read')
const { getOperators } = require('../players/operators')
const { isBusy } = require('../utils/busy')

const { getCurrentState, getChangedState } = require('./state')

describe('calls', () => {
  const versions = [
    'version 1',
    'version 2'
  ]
  const version = 'version 1'
  const worlds1 = [
    'world 1',
    'world 2'
  ]
  const worlds2 = [
    'world 3',
    'world 4'
  ]
  const world1 = 'world 1'
  const world2 = 'world 3'
  const operators = [{
    uuid: '1',
    name: 'player 1'
  }]
  beforeEach(() => {
    getVersions
      .mockReset()
      .mockResolvedValue(versions)
    getCurrentVersion
      .mockReset()
      .mockResolvedValue(version)
    getWorlds
      .mockReset()
      .mockResolvedValueOnce(worlds1)
      .mockResolvedValueOnce(worlds2)
    getCurrentWorld
      .mockReset()
      .mockResolvedValueOnce(world1)
      .mockResolvedValueOnce(world2)
    getOperators
      .mockReset()
      .mockResolvedValue(operators)
    isBusy
      .mockReset()
      .mockReturnValue(true)
  })
  describe('getFullState', () => {
    it('should return versions, current version, worlds and current world for version', async () => {
      await expect(getCurrentState()).resolves.toStrictEqual({
        versions: {
          'version 1': {
            worlds: worlds1,
            world: world1
          },
          'version 2': {
            worlds: worlds2,
            world: world2
          }
        },
        version,
        operators,
        busy: true
      })
      expect(getVersions).toHaveBeenCalled()
      expect(getWorlds).toHaveBeenCalledWith(version)
      expect(getWorlds).toHaveBeenCalledWith('version 2')
      expect(getCurrentWorld).toHaveBeenCalledWith(version)
      expect(getCurrentWorld).toHaveBeenCalledWith('version 2')
      expect(getCurrentVersion).toHaveBeenCalled()
      expect(getOperators).toHaveBeenCalled()
    })
  })
  describe('getChangedState', () => {
    it('should only return busy: true when emitting state before running action', async () => {
      await expect(getChangedState(true)).resolves.toStrictEqual({ busy: true })
    })
    it('should return full state with busy: false after running action', async () => {
      await expect(getChangedState(false)).resolves.toStrictEqual({
        versions: {
          'version 1': {
            worlds: worlds1,
            world: world1
          },
          'version 2': {
            worlds: worlds2,
            world: world2
          }
        },
        version,
        operators,
        busy: false
      })
    })
  })
})
