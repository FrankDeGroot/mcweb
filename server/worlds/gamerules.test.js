'use strict'

jest.mock('../service/rcon')
jest.mock('./list_gamerules')

const { send } = require('../service/rcon')
const { getGamerulesDefinitions } = require('./list_gamerules')

const { getGamerules } = require('./gamerules')

describe('getGameRules', () => {
  it('gets the gamerules', async () => {
    getGamerulesDefinitions.mockReturnValue({
      keepInventory: {
        type: 'boolean'
      }
    })
    send.mockResolvedValue('The value of gamerule keepInventory is: true')

    await expect(getGamerules()).resolves.toStrictEqual({
      keepInventory: {
        type: 'boolean',
        value: true
      }
    })
  })
})
