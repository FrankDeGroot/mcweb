'use strict'

const { ChangeViewModel } = require('../../public/change/change_view_model')

const handlers = {
  onChangeVersionAndWorld: jest.fn(),
  onCreateWorld: jest.fn(),
  onUpdateVersion: jest.fn()
}

const changeScheduler = {
  schedule: jest.fn()
}

const versionsAndWorlds = {
  versions: {
    'version 1': {
      worlds: [
        'world 1',
        'world 2'
      ],
      world: 'world 1'
    },
    'version 2': {
      worlds: [
        'world 3',
        'world 4'
      ],
      world: 'world 3'
    }
  },
  version: 'version 1'
}

describe('ChangeViewModel', () => {
  let changeViewModel
  beforeEach(() => {
    changeViewModel = new ChangeViewModel(handlers, changeScheduler)
    handlers.onChangeVersionAndWorld.mockReset()
    handlers.onCreateWorld.mockReset()
    handlers.onUpdateVersion.mockReset()
    changeScheduler.schedule.mockReset()
  })
  it('should initialize properly', () => {
    expect(changeViewModel.versions).toStrictEqual([])
  })
  it('should load version and world', () => {
    changeViewModel.setCurrent(versionsAndWorlds)
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
  it('should retain selected version and world when previously selected', () => {
    changeViewModel.setCurrent(versionsAndWorlds)
    changeViewModel.selectVersionAndWorld(JSON.stringify({ version: 'version 2', world: 'world 4' }))
    changeViewModel.setCurrent(versionsAndWorlds)
    changeViewModel.changeVersionAndWorld()
    expect(handlers.onChangeVersionAndWorld).toHaveBeenCalledWith('version 2', 'world 4')
  })
  it('should not retain selected version and world when previously selected are gone', () => {
    changeViewModel.setCurrent(versionsAndWorlds)
    changeViewModel.selectVersionAndWorld(JSON.stringify({ version: 'version 2', world: 'world 4' }))
    changeViewModel.setCurrent({
      versions: {
        'version 1': {
          worlds: [
            'world 1',
            'world 2'
          ],
          world: 'world 1'
        }
      },
      version: 'version 1'
    })
    changeViewModel.changeVersionAndWorld()
    expect(handlers.onChangeVersionAndWorld).toHaveBeenCalledWith('version 1', 'world 1')
  })
  it('should not retain selected world when previously selected is gone', () => {
    changeViewModel.setCurrent(versionsAndWorlds)
    changeViewModel.selectVersionAndWorld(JSON.stringify({ version: 'version 1', world: 'world 2' }))
    changeViewModel.setCurrent({
      versions: {
        'version 1': {
          worlds: [
            'world 1'
          ],
          world: 'world 1'
        }
      },
      version: 'version 1'
    })
    changeViewModel.changeVersionAndWorld()
    expect(handlers.onChangeVersionAndWorld).toHaveBeenCalledWith('version 1', 'world 1')
  })
  it('should change version and world', () => {
    changeViewModel.selectVersionAndWorld(JSON.stringify({ version: 'version 1', world: 'world 1' }))
    changeViewModel.changeVersionAndWorld()
    expect(handlers.onChangeVersionAndWorld).toHaveBeenCalledWith('version 1', 'world 1')
  })
})
