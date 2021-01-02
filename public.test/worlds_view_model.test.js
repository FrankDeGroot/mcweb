'use strict'

jest.mock('../public/scheduler')
const { Scheduler } = require('../public/scheduler')
const { WorldsViewModel } = require('../public/worlds_view_model')

const handlers = {
  onChange: jest.fn(),
  onChangeVersionAndWorld: jest.fn(),
  onCreateWorld: jest.fn(),
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
    expect(worldsViewModel.busy).toBe(false)
  })
  it('should set busy', () => {
    worldsViewModel.busy = true
    expect(changeScheduler.schedule).toHaveBeenCalled()
  })
  it('should clear busy and raise onReady', () => {
    worldsViewModel.busy = true
    worldsViewModel.busy = false
    expect(handlers.onReady).toHaveBeenCalled()
    expect(changeScheduler.schedule).toHaveBeenCalled()
  })
  it('should load version and world', () => {
    worldsViewModel.loadVersionAndWorld({
      versions: [{
        version: 'version 1',
        worlds: [
          'world 1',
          'world 2'
        ],
        world: 'world 1'
      }, {
        version: 'version 2',
        worlds: [
          'world 3',
          'world 4'
        ],
        world: 'world 3'
      }],
      version: 'version 1'
    })
    expect(worldsViewModel.versions).toStrictEqual([{
      label: 'version 1 (current)',
      options: [{
        label: 'version 1 world 1 (current)',
        selected: true,
        value: JSON.stringify({ version: 'version 1', world: 'world 1' })
      }, {
        label: 'version 1 world 2',
        selected: false,
        value: JSON.stringify({ version: 'version 1', world: 'world 2' })
      }],
      selected: true,
      value: 'version 1'
    }, {
      label: 'version 2',
      options: [{
        label: 'version 2 world 3 (current)',
        selected: false,
        value: JSON.stringify({ version: 'version 2', world: 'world 3' })
      }, {
        label: 'version 2 world 4',
        selected: false,
        value: JSON.stringify({ version: 'version 2', world: 'world 4' })
      }],
      selected: false,
      value: 'version 2'
    }])
    expect(changeScheduler.schedule).toHaveBeenCalled()
  })
  it('should update version', () => {
    worldsViewModel.updateVersion('release')
    expect(handlers.onUpdateVersion).toHaveBeenCalledWith('release')
  })
  it('should not update version that cannot be updated', () => {
    worldsViewModel.currentVersion = 'a'
    worldsViewModel.updateVersion()
    expect(handlers.onUpdateVersion).not.toHaveBeenCalledWith('a')
  })
  it('should change version and world', () => {
    worldsViewModel.selectVersionAndWorld(JSON.stringify({ version: 'version 1', world: 'world 1' }))
    worldsViewModel.changeVersionAndWorld()
    expect(handlers.onChangeVersionAndWorld).toHaveBeenCalledWith('version 1', 'world 1')
  })
  it('should create world', () => {
    worldsViewModel.selectVersion('version 1')
    worldsViewModel.newWorldName = 'b'
    worldsViewModel.seed = 'c'
    worldsViewModel.createWorld()
    expect(handlers.onCreateWorld).toHaveBeenCalledWith('version 1', 'b', 'c')
  })
})
