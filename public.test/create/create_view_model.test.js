'use strict'

const { CreateViewModel } = require('../../public/create/create_view_model')

const handlers = {
  onCreateWorld: jest.fn()
}

const changeScheduler = {
  schedule: jest.fn()
}

describe('CreateViewModel', () => {
  let createViewModel
  beforeEach(() => {
    createViewModel = new CreateViewModel(handlers, changeScheduler)
  })
  it('should initialize properly', () => {
    expect(createViewModel.versions).toStrictEqual([])
  })
  it('should load version and world', () => {
    createViewModel.setCurrent({
      versions: {
        'version 1': {
        },
        'version 2': {
        }
      },
      version: 'version 1'
    })
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
  it('should create world', () => {
    createViewModel.selectVersion('version 1')
    createViewModel.newWorldName = 'b'
    createViewModel.seed = 'c'
    createViewModel.createWorld()
    expect(handlers.onCreateWorld).toHaveBeenCalledWith('version 1', 'b', 'c')
    expect(changeScheduler.schedule).toHaveBeenCalled()
  })
})
