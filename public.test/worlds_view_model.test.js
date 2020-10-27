'use strict'
jest.mock('../public/scheduler')
const { Scheduler } = require('../public/scheduler')
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
  schedule: jest.fn()
}

describe('ViewModel', () => {
  let worldsViewModel
  beforeEach(() => {
    Scheduler.mockImplementation(handler => {
      expect(handler).toBe(handlers.onChange)
      return changeScheduler
    })
    worldsViewModel = new WorldsViewModel(handlers)
  })
  it('should initialize properly', () => {
    expect(worldsViewModel.versions).toStrictEqual([])
    expect(worldsViewModel.worlds).toStrictEqual([])
    expect(worldsViewModel.currentVersion).toBe(null)
    expect(worldsViewModel.currentWorld).toBe(null)
    expect(worldsViewModel.busy).toBe(false)
    expect(worldsViewModel.canUpdate).toBe(false)
  })
  it('should load world', () => {
    worldsViewModel.loadWorld({ worlds: ['a', 'b'], world: 'b' })
    expect(worldsViewModel.worlds).toStrictEqual(['a', 'b'])
    expect(worldsViewModel.currentWorld).toBe('b')
    expect(changeScheduler.schedule).toHaveBeenCalled()
  })
  it('should load version and world', () => {
    worldsViewModel.loadVersionAndWorld({
      versions: ['a', 'b'],
      version: 'b',
      worlds: ['c', 'd'],
      world: 'd'
    })
    expect(worldsViewModel.versions).toStrictEqual(['a', 'b'])
    expect(worldsViewModel.currentVersion).toBe('b')
    expect(worldsViewModel.worlds).toStrictEqual(['c', 'd'])
    expect(worldsViewModel.currentWorld).toBe('d')
    expect(changeScheduler.schedule).toHaveBeenCalled()
  })
})
