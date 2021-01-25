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
    expect(gamerulesViewModel.keepInventory).toBe(false)
  })
  it('should load state', () => {
    gamerulesViewModel.setCurrent({
      gamerules: {
        keepInventory: true
      }
    })
    expect(gamerulesViewModel.keepInventory).toBe(true)
  })
  it('should emit for changed gamerule', () => {
    gamerulesViewModel.keepInventory = true
    expect(socket.emit).toHaveBeenCalledWith('setGamerules', { keepInventory: true })
  })
})
