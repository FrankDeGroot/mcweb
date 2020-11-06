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
  onUpdateVersion: jest.fn(),
  onCreateWorld: jest.fn()
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
  it('should set currentVersion and raise events if changed', () => {
    worldsViewModel.currentVersion = 'a'
    expect(handlers.onChangeVersion).toHaveBeenCalledWith('a')
    expect(changeScheduler.schedule).toHaveBeenCalled()
  })
  it('should set currentWorld and raise events if changed', () => {
    worldsViewModel.currentWorld = 'a'
    expect(handlers.onChangeWorld).toHaveBeenCalledWith('a')
    expect(changeScheduler.schedule).toHaveBeenCalled()
  })
  it('should set busy and raise onBusy', () => {
    worldsViewModel.busy = true
    expect(handlers.onBusy).toHaveBeenCalled()
    expect(changeScheduler.schedule).toHaveBeenCalled()
  })
  it('should clear busy and raise onReady', () => {
    worldsViewModel.busy = true
    worldsViewModel.busy = false
    expect(handlers.onReady).toHaveBeenCalled()
    expect(changeScheduler.schedule).toHaveBeenCalled()
  })
  it('canUpdate when not busy and currentVersion release or snapshot', () => {
    worldsViewModel.currentVersion = 'release'
    expect(worldsViewModel.canUpdate).toBe(true)
  })
  it('not canUpdate when busy', () => {
    worldsViewModel.currentVersion = 'snapshot'
    worldsViewModel.busy = true
    expect(worldsViewModel.canUpdate).toBe(false)
  })
  it('not canUpdate when currentVersion not release or snapshot', () => {
    worldsViewModel.currentVersion = 'a'
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
  it('should update version', () => {
    worldsViewModel.currentVersion = 'release'
    worldsViewModel.updateVersion()
    expect(handlers.onUpdateVersion).toHaveBeenCalledWith('release')
  })
  it('should not update version that cannot be updated', () => {
    worldsViewModel.currentVersion = 'a'
    worldsViewModel.updateVersion()
    expect(handlers.onUpdateVersion).not.toHaveBeenCalledWith('a')
  })
  it('should change version and world', () => {
    worldsViewModel.currentVersion = 'a'
    worldsViewModel.currentWorld = 'b'
    worldsViewModel.changeVersionAndWorld()
    expect(handlers.onChangeVersionAndWorld).toHaveBeenCalledWith('a', 'b')
  })
  it('should create world', () => {
    worldsViewModel.currentVersion = 'a'
    worldsViewModel.newWorldName = 'b'
    worldsViewModel.seed = 'c'
    worldsViewModel.createWorld()
    expect(handlers.onCreateWorld).toHaveBeenCalledWith('a', 'b', 'c')
  })
})
