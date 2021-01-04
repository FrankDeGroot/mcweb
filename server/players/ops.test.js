'use strict'

jest.mock('fs')

const { readFile } = require('fs').promises

const { operators } = require('./ops')

describe('operators', () => {
  beforeAll(() => {
    readFile.mockReset()
  })
  it('should list all players in inclusion and ops list', async () => {
    readFile.mockResolvedValueOnce(JSON.stringify([{
      uuid: '1',
      name: 'player 1'
    }, {
      uuid: '2',
      name: 'player 2'
    }]))
    readFile.mockResolvedValueOnce(JSON.stringify([{
      uuid: '3',
      name: 'player 3',
      level: 2,
      bypassesPlayerLimit: true
    }, {
      uuid: '4',
      name: 'player 4',
      level: 3,
      bypassesPlayerLimit: true
    }]))

    expect(await operators()).toStrictEqual([{
      uuid: '1',
      name: 'player 1',
      level: 0,
      bypassesPlayerLimit: false
    }, {
      uuid: '2',
      name: 'player 2',
      level: 0,
      bypassesPlayerLimit: false
    }, {
      uuid: '3',
      name: 'player 3',
      level: 2,
      bypassesPlayerLimit: true
    }, {
      uuid: '4',
      name: 'player 4',
      level: 3,
      bypassesPlayerLimit: true
    }])
  })
  it('should merge duplicate players in inclusion and ops list', async () => {
    readFile.mockResolvedValueOnce(JSON.stringify([{
      uuid: '1',
      name: 'player 1'
    }]))
    readFile.mockResolvedValueOnce(JSON.stringify([{
      uuid: '1',
      name: 'player 1',
      level: 4,
      bypassesPlayerLimit: true
    }]))

    expect(await operators()).toStrictEqual([{
      uuid: '1',
      name: 'player 1',
      level: 4,
      bypassesPlayerLimit: true
    }])
  })
})
