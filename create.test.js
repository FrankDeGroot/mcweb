'use strict'

jest.mock('fs')
jest.mock('./mcproperties.js')
jest.mock('./mcpaths')
jest.mock('./restart')

const { mkdir, symlink, unlink } = require('fs').promises
const { readServerProperties, writeServerProperties } = require('./mcproperties.js')
const { currentWorldPath, worldPath } = require('./mcpaths')
const { restart } = require('./restart')

const { create } = require('./create')

const notify = jest.fn()

describe('create', () => {
  it('should set seed in server properties, create the world directory and set current world while restarting the server', async () => {
    readServerProperties.mockReturnValue({ property: 'value', 'level-seed': 'old value' })
    currentWorldPath.mockReturnValue('currentWorldPath')
    worldPath.mockReturnValue('worldPath')
    restart.mockImplementation(async (reason, notify, reconfigure) => {
      await reconfigure()
      expect(unlink).toHaveBeenCalledWith('currentWorldPath')
      expect(symlink).toHaveBeenCalledWith('world name', 'currentWorldPath')
    })

    await create('version name', 'world name', 'new value', notify)

    expect(writeServerProperties).toHaveBeenCalledWith({ property: 'value', 'level-seed': 'new value' })
    expect(mkdir).toHaveBeenCalledWith('worldPath')
    expect(restart).toHaveBeenCalledWith('Creating a new world', notify, expect.any(Function))
  })
})
