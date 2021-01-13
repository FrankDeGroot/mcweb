'use strict'

jest.mock('../worlds/read')
jest.mock('../worlds/change')
jest.mock('../download/update')
jest.mock('../worlds/create')
jest.mock('../players/operators')

const {
  getCurrentVersion,
  getCurrentWorld,
  getVersions,
  getWorlds
} = require('../worlds/read')
const { change } = require('../worlds/change')
const { update } = require('../download/update')
const { create } = require('../worlds/create')
const { getOperators } = require('../players/operators')

const calls = require('./calls')

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
  const world = 'world'
  const world1 = 'world 1'
  const world2 = 'world 3'
  const notify = jest.fn()
  const seed = 'seed'
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
  describe('change', () => {
    it('should extract parameters and call change', () => {
      calls.change(notify, { version, world })

      expect(change).toHaveBeenCalledWith(version, world, notify)
    })
  })
  describe('update', () => {
    it('should extract parameters and call update', () => {
      calls.update(notify, { version })

      expect(update).toHaveBeenCalledWith(version, notify)
    })
  })
  describe('create', () => {
    it('should extract parameters and call create', () => {
      calls.create(notify, { version, world, seed })

      expect(create).toHaveBeenCalledWith(version, world, seed, notify)
    })
  })
})
