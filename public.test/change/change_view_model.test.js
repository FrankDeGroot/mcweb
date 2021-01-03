'use strict'

jest.mock('../../public/scheduler')
const { Scheduler } = require('../../public/scheduler')
const { ChangeViewModel } = require('../../public/change/change_view_model')

const handlers = {
  onChange: jest.fn(),
  onChangeVersionAndWorld: jest.fn(),
  onCreateWorld: jest.fn(),
  onUpdateVersion: jest.fn()
}

const changeScheduler = {
  schedule: jest.fn()
}

describe('ChangeViewModel', () => {
  let changeViewModel
  beforeEach(() => {
    Scheduler.mockImplementation(handler => {
      expect(handler).toBe(handlers.onChange)
      return changeScheduler
    })
    changeViewModel = new ChangeViewModel(handlers)
  })
  it('should initialize properly', () => {
    expect(changeViewModel.versions).toStrictEqual([])
  })
  it('should load version and world', () => {
    changeViewModel.setCurrent({
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
    expect(changeViewModel.versions).toStrictEqual([{
      label: 'version 1 (current)',
      options: [{
        label: 'version 1 world 1 (current)',
        selected: true,
        value: JSON.stringify({ version: 'version 1', world: 'world 1' })
      }, {
        label: 'version 1 world 2',
        selected: false,
        value: JSON.stringify({ version: 'version 1', world: 'world 2' })
      }]
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
      }]
    }])
    expect(changeScheduler.schedule).toHaveBeenCalled()
  })
  it('should change version and world', () => {
    changeViewModel.selectVersionAndWorld(JSON.stringify({ version: 'version 1', world: 'world 1' }))
    changeViewModel.changeVersionAndWorld()
    expect(handlers.onChangeVersionAndWorld).toHaveBeenCalledWith('version 1', 'world 1')
  })
})
