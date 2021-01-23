'use strict'

const { CreateViewModel } = require('../../public/create/create_view_model')

const handlers = {
  onCreateWorld: jest.fn()
}

const changeScheduler = {
  schedule: jest.fn()
}

const current = {
  versions: {
    'version 1': {},
    'version 2': {}
  },
  version: 'version 1',
  busy: false
}

describe('CreateViewModel', () => {
  let createViewModel
  beforeEach(() => {
    createViewModel = new CreateViewModel(handlers, changeScheduler)
    handlers.onCreateWorld.mockReset()
    changeScheduler.schedule.mockReset()
  })
  it('should initialize properly', () => {
    expect(createViewModel.versions).toStrictEqual([])
  })
  it('should load version and world', () => {
    createViewModel.setCurrent(current)
    expect(createViewModel.versions).toStrictEqual([{
      label: 'version 1 (current)',
      selected: true,
      value: 'version 1'
    }, {
      label: 'version 2',
      selected: false,
      value: 'version 2'
    }])
    expect(changeScheduler.schedule).toHaveBeenCalled()
  })
  it('should retain selected version when reloading', () => {
    createViewModel.setCurrent(current)
    createViewModel.selectVersion('version 2')
    createViewModel.newWorldName = 'b'
    createViewModel.seed = 'c'
    createViewModel.setCurrent(current)
    createViewModel.createWorld()
    expect(handlers.onCreateWorld).toHaveBeenCalledWith('version 2', 'b', 'c')
  })
  it('should reset selected version when no longer exists after reloading', () => {
    createViewModel.setCurrent(current)
    createViewModel.selectVersion('version 2')
    createViewModel.newWorldName = 'b'
    createViewModel.seed = 'c'
    createViewModel.setCurrent({
      versions: {
        'version 1': {}
      },
      version: 'version 1'
    })
    createViewModel.createWorld()
    expect(handlers.onCreateWorld).toHaveBeenCalledWith('version 1', 'b', 'c')
  })
  it('should not schedule change if world name is not changed', () => {
    createViewModel.newWorldName = null
    expect(changeScheduler.schedule).not.toHaveBeenCalled()
  })
  it('should schedule change if world name is changed', () => {
    createViewModel.newWorldName = 'test'
    expect(changeScheduler.schedule).toHaveBeenCalled()
  })
  it('should enable controls except create button if not busy', () => {
    createViewModel.setCurrent(current)
    expect(createViewModel.versionSelectDisabled).toBe(false)
    expect(createViewModel.nameInputDisabled).toBe(false)
    expect(createViewModel.seedInputDisabled).toBe(false)
    expect(createViewModel.createButtonDisabled).toBe(true)
  })
  it('should disable controls if busy', () => {
    createViewModel.setCurrent({ ...current, ...{ busy: true } })
    expect(createViewModel.versionSelectDisabled).toBe(true)
    expect(createViewModel.nameInputDisabled).toBe(true)
    expect(createViewModel.seedInputDisabled).toBe(true)
    expect(createViewModel.createButtonDisabled).toBe(true)
  })
  it('should enable create button if not busy and name not empty', () => {
    createViewModel.setCurrent(current)
    createViewModel.newWorldName = 'test'
    expect(createViewModel.createButtonDisabled).toBe(false)
  })
  it('should create world', () => {
    createViewModel.setCurrent(current)
    createViewModel.selectVersion('version 1')
    createViewModel.newWorldName = 'b'
    createViewModel.seed = 'c'
    createViewModel.createWorld()
    expect(handlers.onCreateWorld).toHaveBeenCalledWith('version 1', 'b', 'c')
    expect(changeScheduler.schedule).toHaveBeenCalled()
  })
})
