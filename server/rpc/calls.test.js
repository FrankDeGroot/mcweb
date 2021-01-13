'use strict'

jest.mock('../worlds/read')
jest.mock('../worlds/change')
jest.mock('../download/update')
jest.mock('../worlds/create')
jest.mock('../players/ops')

const get = require('../worlds/read')
const { change } = require('../worlds/change')
const { update } = require('../download/update')
const { create } = require('../worlds/create')
const { operators } = require('../players/ops')

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
  const players = [{
    uuid: '1',
    name: 'player 1'
  }]

  beforeEach(() => {
    get.versions.mockReset()
    get.currentVersion.mockReset()
    get.worlds.mockReset()
    get.currentWorld.mockReset()
    operators.mockReset()
  })
  describe('current', () => {
    it('should return versions, current version, worlds and current world for version', async () => {
      get.versions.mockResolvedValue(versions)
      get.currentVersion.mockResolvedValue(version)
      get.worlds
        .mockResolvedValueOnce(worlds1)
        .mockResolvedValueOnce(worlds2)
      get.currentWorld
        .mockResolvedValueOnce(world1)
        .mockResolvedValueOnce(world2)
      operators.mockResolvedValue(players)
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
        ops: players
      })
      expect(get.versions).toHaveBeenCalled()
      expect(get.worlds).toHaveBeenCalledWith(version)
      expect(get.worlds).toHaveBeenCalledWith('version 2')
      expect(get.currentWorld).toHaveBeenCalledWith(version)
      expect(get.currentWorld).toHaveBeenCalledWith('version 2')
      expect(get.currentVersion).toHaveBeenCalled()
      expect(operators).toHaveBeenCalled()
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
