'use strict'

jest.mock('fs')

const { readFile, writeFile } = require('fs').promises

const { getOperators, saveOperator } = require('./operators')

describe('getOperators', () => {
  beforeEach(() => {
    readFile.mockReset()
    writeFile.mockReset()
  })
  it('should list all players in inclusion and operators list', async () => {
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
    readFile.mockResolvedValueOnce(JSON.stringify([{
      uuid: '1',
      name: 'player 1'
    }, {
      uuid: '2',
      name: 'player 2'
    }]))
    await expect(getOperators()).resolves.toStrictEqual([{
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
    expect(readFile.mock.calls[0][0]).toBe('../test/server/common/ops.json')
    expect(readFile.mock.calls[1][0]).toBe('../test/server/common/whitelist.json')
  })
  it('should merge duplicate players in inclusion and operators list', async () => {
    readFile.mockResolvedValueOnce(JSON.stringify([{
      uuid: '1',
      name: 'player 1',
      level: 4,
      bypassesPlayerLimit: true
    }]))
    readFile.mockResolvedValueOnce(JSON.stringify([{
      uuid: '1',
      name: 'player 1'
    }]))
    await expect(getOperators()).resolves.toStrictEqual([{
      uuid: '1',
      name: 'player 1',
      level: 4,
      bypassesPlayerLimit: true
    }])
  })
  it('should accept absence of file with allowed players', async () => {
    readFile.mockResolvedValueOnce(JSON.stringify([{
      uuid: '1',
      name: 'player 1',
      level: 1,
      bypassesPlayerLimit: true
    }]))
    const fileNotFoundError = new Error('file not found')
    fileNotFoundError.code = 'ENOENT'
    readFile.mockRejectedValueOnce(fileNotFoundError)
    await expect(getOperators()).resolves.toStrictEqual([{
      uuid: '1',
      name: 'player 1',
      level: 1,
      bypassesPlayerLimit: true
    }])
    expect(readFile.mock.calls[0][0]).toBe('../test/server/common/ops.json')
    expect(readFile.mock.calls[1][0]).toBe('../test/server/common/whitelist.json')
  })
})

describe('saveOperator', () => {
  beforeEach(() => {
    readFile.mockReset()
    writeFile.mockReset()
  })
  const operators = JSON.stringify([{
    uuid: '1',
    name: 'player 1',
    level: 1,
    bypassesPlayerLimit: false
  }, {
    uuid: '2',
    name: 'player 2',
    level: 2,
    bypassesPlayerLimit: false
  }])
  it('should update an operator', async () => {
    const operator = {
      uuid: '1',
      name: 'player 1',
      level: 4,
      bypassesPlayerLimit: true
    }
    readFile.mockResolvedValueOnce(operators)
    await saveOperator(operator)
    expect(writeFile.mock.calls[0][0]).toBe('../test/server/common/ops.json')
    expect(writeFile.mock.calls[0][1]).toBe(JSON.stringify([{
      uuid: '1',
      name: 'player 1',
      level: 4,
      bypassesPlayerLimit: true
    }, {
      uuid: '2',
      name: 'player 2',
      level: 2,
      bypassesPlayerLimit: false
    }]))
  })
  it('should update an operator with partial data', async () => {
    const operator = {
      uuid: '1',
      level: 4
    }
    readFile.mockResolvedValueOnce(operators)
    await saveOperator(operator)
    expect(writeFile.mock.calls[0][1]).toBe(JSON.stringify([{
      uuid: '1',
      name: 'player 1',
      level: 4,
      bypassesPlayerLimit: false
    }, {
      uuid: '2',
      name: 'player 2',
      level: 2,
      bypassesPlayerLimit: false
    }]))
  })
})
