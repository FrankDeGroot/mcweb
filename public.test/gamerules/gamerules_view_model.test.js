'use strict'

const { GamerulesViewModel } = require('../../public/gamerules/gamerules_view_model.js')

const socket = {
  emit: jest.fn()
}
const changeScheduler = {
  schedule: jest.fn()
}

describe('GamerulesViewModel', () => {
  let gamerulesViewModel
  beforeEach(() => {
    socket.emit.mockReset()
    changeScheduler.schedule.mockReset()
    gamerulesViewModel = new GamerulesViewModel(socket, changeScheduler)
  })
  it('should initialize properly', () => {
    expect(gamerulesViewModel.gamerules).toStrictEqual({})
  })
  it('should load state', () => {
    gamerulesViewModel.setCurrent({
      gamerules: {
        keepInventory: {
          type: 'boolean',
          value: true
        }
      }
    })
    expect(gamerulesViewModel.gamerules).toStrictEqual({
      keepInventory: {
        type: 'boolean',
        value: true
      }
    })
  })
  it('should not emit for unchanged gamerule', () => {
    gamerulesViewModel.setCurrent({
      gamerules: {
        keepInventory: {
          type: 'boolean',
          value: true
        }
      }
    })
    gamerulesViewModel.setGamerule('keepInventory', true)
    expect(socket.emit).not.toHaveBeenCalled()
  })
  it('should emit for changed gamerule', () => {
    gamerulesViewModel.setCurrent({
      gamerules: {
        keepInventory: {
          type: 'boolean',
          value: true
        }
      }
    })
    gamerulesViewModel.setGamerule('keepInventory', false)
    expect(socket.emit).toHaveBeenCalledWith('setGamerules', {
      keepInventory: {
        type: 'boolean',
        value: false
      }
    })
  })
})
