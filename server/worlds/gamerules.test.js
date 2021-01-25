'use strict'

jest.mock('../service/rcon')

const { send } = require('../service/rcon')

const { getGamerules } = require('./gamerules')

describe('getGameRules', () => {
  it('gets the gamerules', async () => {
    send.mockResolvedValue('The value of gamerule keepInventory is: true')

    await expect(getGamerules()).resolves.toStrictEqual({
      keepInventory: true
    })
  })
})
