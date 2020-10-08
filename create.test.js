'use strict'

jest.mock('./mcproperties.js')

const { readServerProperties, writeServerProperties } = require('./mcproperties.js')

const { create } = require('./create')

const notify = jest.fn()

describe('create', () => {
  it('should set seed in server properties', async () => {
    readServerProperties.mockReturnValue({ property: 'value', 'level-seed': 'old value' })

    await create('new value', notify)

    expect(writeServerProperties).toHaveBeenCalledWith({ property: 'value', 'level-seed': 'new value' })
  })
})
