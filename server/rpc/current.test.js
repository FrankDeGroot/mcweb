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

const calls = require('./current')

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
    getVersions.mockReset()
    getCurrentVersion.mockReset()
    getWorlds.mockReset()
    getCurrentWorld.mockReset()
    getOperators.mockReset()
  })
  describe('current', () => {
    it('should return versions, current version, worlds and current world for version', async () => {
      getVersions.mockResolvedValue(versions)
      getCurrentVersion.mockResolvedValue(version)
      getWorlds
        .mockResolvedValueOnce(worlds1)
        .mockResolvedValueOnce(worlds2)
      getCurrentWorld
        .mockResolvedValueOnce(world1)
        .mockResolvedValueOnce(world2)
      getOperators.mockResolvedValue(operators)
      await expect(calls.current()).resolves.toEqual({
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
        operators
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
})
