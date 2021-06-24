'use strict'

jest.mock('../worlds/read')

const {
  getVersions,
  getWorlds,
  getCurrentWorld
} = require('../worlds/read')
const { getVersionsWorlds } = require('./versions_worlds')

describe('versionsWorlds', () => {
  const versions = [
    'version 1',
    'version 2'
  ]
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
  beforeEach(() => {
    getVersions
      .mockReset()
      .mockResolvedValue(versions)
    getWorlds
      .mockReset()
      .mockResolvedValueOnce(worlds1)
      .mockResolvedValueOnce(worlds2)
    getCurrentWorld
      .mockReset()
      .mockResolvedValueOnce(world1)
      .mockResolvedValueOnce(world2)
  })
  it('should assemble versions and worlds', async () => {
    await expect(getVersionsWorlds()).resolves.toStrictEqual({
      'version 1': {
        worlds: worlds1,
        world: world1
      },
      'version 2': {
        worlds: worlds2,
        world: world2
      }
    })
    expect(getWorlds).toHaveBeenCalledWith('version 1')
    expect(getWorlds).toHaveBeenCalledWith('version 2')
    expect(getCurrentWorld).toHaveBeenCalledWith('version 1')
    expect(getCurrentWorld).toHaveBeenCalledWith('version 2')
  })
})
