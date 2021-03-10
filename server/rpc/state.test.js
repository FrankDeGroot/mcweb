'use strict'

jest.mock('../worlds/gamerules')
jest.mock('../worlds/read')
jest.mock('../worlds/versions_worlds')
jest.mock('../players/operators')
jest.mock('../utils/busy')

const { getCurrentVersion } = require('../worlds/read')
const { getVersionsWorlds } = require('../worlds/versions_worlds')
const { getGamerules } = require('../worlds/gamerules')
const { getOperators } = require('../players/operators')
const { isBusy } = require('../utils/busy')

const { getCurrentState, getChangedState } = require('./state')

describe('calls', () => {
  const version = 'version 1'
  const versionsWorlds = {
    'version 1': {
      worlds: [
        'world 1',
        'world 2'
      ],
      world: 'world 1'
    }
  }
  const gamerules = {
    keepInventory: true
  }
  const operators = [{
    uuid: '1',
    name: 'player 1'
  }]
  beforeEach(() => {
    getCurrentVersion
      .mockReset()
      .mockResolvedValue(version)
    getVersionsWorlds
      .mockReset()
      .mockResolvedValue(versionsWorlds)
    getGamerules
      .mockReset()
      .mockResolvedValue(gamerules)
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
            worlds: [
              'world 1',
              'world 2'
            ],
            world: 'world 1'
          }
        },
        version,
        operators,
        gamerules,
        busy: true
      })
      expect(getCurrentVersion).toHaveBeenCalled()
      expect(getVersionsWorlds).toHaveBeenCalled()
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
            worlds: [
              'world 1',
              'world 2'
            ],
            world: 'world 1'
          }
        },
        version,
        operators,
        gamerules,
        busy: false
      })
    })
  })
})
