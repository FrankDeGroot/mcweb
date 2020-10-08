'use strict'

jest.mock('./../mcget')
jest.mock('./../mcset')
jest.mock('./../update/update')
jest.mock('./../create')

const get = require('./../mcget')
const { change } = require('./../mcset')
const { update } = require('./../update/update')
const { create } = require('./../create')

const calls = require('./calls')

describe('calls', () => {
  const versions = {}
  const version = 'version'
  const worlds = {}
  const world = 'world'
  const notify = jest.fn()
  const seed = 'seed'

  beforeEach(() => {
    get.versions.mockReset()
    get.currentVersion.mockReset()
    get.worlds.mockReset().mockResolvedValue(worlds)
    get.currentWorld.mockReset().mockResolvedValue(world)
  })
  describe('worlds', () => {
    it('should return worlds for version and current world', async () => {
      await expect(calls.worlds(version)).resolves.toEqual({
        worlds,
        world
      })
      expect(get.worlds).toHaveBeenCalledWith(version)
      expect(get.currentWorld).toHaveBeenCalledWith(version)
    })
  })
  describe('current', () => {
    it('should return versions, current version, worlds and current world for version', async () => {
      get.currentVersion.mockResolvedValue(version)
      get.versions.mockResolvedValue(versions)
      await expect(calls.current()).resolves.toEqual({
        versions,
        version,
        worlds,
        world
      })
      expect(get.worlds).toHaveBeenCalledWith(version)
      expect(get.currentWorld).toHaveBeenCalledWith(version)
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
