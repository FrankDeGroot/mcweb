'use strict'
jest.mock('../public/change_scheduler')
const { ChangeScheduler } = require('../public/change_scheduler')
const { WorldsViewModel } = require('../public/worlds_view_model')

const handlers = {
  onBusy: jest.fn(),
  onChange: jest.fn(),
  onChangeVersion: jest.fn(),
  onChangeVersionAndWorld: jest.fn(),
  onChangeWorld: jest.fn(),
  onReady: jest.fn(),
  onUpdateVersion: jest.fn()
}

const changeScheduler = {
  scheduleChange: jest.fn()
}

describe('ViewModel', () => {
  let worldsViewModel
  beforeEach(() => {
    ChangeScheduler.mockImplementation(handler => {
      expect(handler).toBe(handlers.onChange)
      return changeScheduler
    })
    worldsViewModel = new WorldsViewModel(handlers)
  })
  it('should work', () => {
    expect(worldsViewModel.versions).toStrictEqual([])
    expect(worldsViewModel.worlds).toStrictEqual([])
  })
})
