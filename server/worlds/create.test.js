'use strict'

jest.mock('fs')
jest.mock('./serverproperties.js')
jest.mock('./paths')
jest.mock('../service/restart')

const { mkdir, symlink, unlink } = require('fs').promises
const { readServerProperties, writeServerProperties } = require('./serverproperties.js')
const { getCurrentWorldPath, getWorldPath } = require('./paths')
const { restart } = require('../service/restart')

const { create } = require('./create')

const notify = jest.fn()

describe('create', () => {
  it('should set seed in server properties, create the world directory and set current world while restarting the server', async () => {
    readServerProperties.mockReturnValue({ property: 'value', 'level-seed': 'old value' })
    getCurrentWorldPath.mockReturnValue('getCurrentWorldPath')
    getWorldPath.mockReturnValue('worldPath')
    restart.mockImplementation(async (reason, notify, reconfigure) => {
      await reconfigure()
      expect(unlink).toHaveBeenCalledWith('getCurrentWorldPath')
      expect(symlink).toHaveBeenCalledWith('world name', 'getCurrentWorldPath')
    })

    await create({ version: 'version name', world: 'world name', seed: 'new value' }, notify)

    expect(writeServerProperties).toHaveBeenCalledWith({ property: 'value', 'level-seed': 'new value' })
    expect(mkdir).toHaveBeenCalledWith('worldPath')
    expect(restart).toHaveBeenCalledWith('Creating a new world', notify, expect.any(Function))
  })
})
