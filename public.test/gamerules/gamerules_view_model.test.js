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
    expect(gamerulesViewModel.gamerules).toStrictEqual([])
  })
  it('should sort list gamerules by type and then label', () => {
    gamerulesViewModel.setCurrent({
      gamerules: {
        a: {
          label: 'b',
          type: 'integer',
          value: '1'
        },
        b: {
          label: 'a',
          type: 'integer',
          value: '2'
        },
        c: {
          label: 'c',
          type: 'boolean',
          value: '3'
        }
      }
    })
    expect(gamerulesViewModel.gamerules).toStrictEqual([{
      gamerule: 'c',
      label: 'c',
      type: 'boolean',
      value: '3'
    }, {
      gamerule: 'b',
      label: 'a',
      type: 'integer',
      value: '2'
    }, {
      gamerule: 'a',
      label: 'b',
      type: 'integer',
      value: '1'
    }])
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
