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
    gamerulesViewModel.state = {
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
          value: true
        }
      },
      busy: false
    }
    expect(gamerulesViewModel.gamerules).toStrictEqual([{
      checked: true,
      disabled: false,
      gamerule: 'c',
      indeterminate: false,
      label: 'c',
      type: 'boolean'
    }, {
      disabled: false,
      gamerule: 'b',
      label: 'a',
      type: 'integer',
      value: '2'
    }, {
      disabled: false,
      gamerule: 'a',
      label: 'b',
      type: 'integer',
      value: '1'
    }])
  })
  it('should not emit for unchanged gamerule', () => {
    gamerulesViewModel.state = {
      gamerules: {
        keepInventory: {
          label: 'Keep Inventory',
          type: 'boolean',
          value: true
        }
      },
      busy: false
    }
    gamerulesViewModel.setGamerule('keepInventory', true)
    expect(socket.emit).not.toHaveBeenCalled()
  })
  it('should emit for changed gamerule', () => {
    gamerulesViewModel.state = {
      gamerules: {
        keepInventory: {
          label: 'Keep Inventory',
          type: 'boolean',
          value: true
        }
      },
      busy: false
    }
    gamerulesViewModel.setGamerule('keepInventory', false)
    expect(socket.emit).toHaveBeenCalledWith('setGamerules', {
      keepInventory: {
        value: false
      }
    })
  })
  it('should set indeterminate when gamerule value null or undefined', () => {
    gamerulesViewModel.state = {
      gamerules: {
        keepInventory: {
          label: 'Keep Inventory',
          type: 'boolean',
          value: undefined
        }
      },
      busy: false
    }
    expect(gamerulesViewModel.gamerules).toStrictEqual([{
      checked: false,
      disabled: true,
      gamerule: 'keepInventory',
      label: 'Keep Inventory',
      indeterminate: true,
      type: 'boolean'
    }])
  })
  it('should disable gamerule controls when busy', () => {
    gamerulesViewModel.state = {
      gamerules: {
        keepInventory: {
          label: 'Keep Inventory',
          type: 'boolean',
          value: true
        }
      },
      busy: true
    }
    expect(gamerulesViewModel.gamerules).toStrictEqual([{
      checked: true,
      disabled: true,
      gamerule: 'keepInventory',
      indeterminate: false,
      label: 'Keep Inventory',
      type: 'boolean'
    }])
  })
})
