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
  it('skips unknown gamerules', async () => {
    getGamerulesDefinitions.mockReturnValue({
      known: {
        type: 'boolean'
      },
      unknown: {
        type: 'boolean'
      }
    })
    send
      .mockResolvedValueOnce('The value of gamerule known is: true')
      .mockResolvedValueOnce('Incorrect argument for commandgamerule unknown true<--[HERE]')

    await expect(getGamerules()).resolves.toStrictEqual({
      known: {
        type: 'boolean',
        value: true
      }
    })
  })
})
