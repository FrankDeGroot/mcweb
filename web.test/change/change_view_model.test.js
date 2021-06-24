'use strict'

const { ChangeViewModel } = require('../../web/change/change_view_model')

const socket = {
  emit: jest.fn()
}

const changeScheduler = {
  schedule: jest.fn()
}

const state = {
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
  version: 'version 1',
  busy: false
}

describe('ChangeViewModel', () => {
  let changeViewModel
  beforeEach(() => {
    changeViewModel = new ChangeViewModel(socket, changeScheduler)
    socket.emit.mockReset()
    changeScheduler.schedule.mockReset()
  })
  it('should initialize properly', () => {
    expect(changeViewModel.versions).toStrictEqual([])
  })
  it('should load version and world', () => {
    changeViewModel.state = state
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
  it('should calculate size of the select list items', () => {
    changeViewModel.state = state
    expect(changeViewModel.versionAndWorldSelectSize).toBe(6)
  })
  it('should retain selected version and world when previously selected', () => {
    changeViewModel.state = state
    changeViewModel.selectVersionAndWorld(JSON.stringify({ version: 'version 2', world: 'world 4' }))
    changeViewModel.state = state
    changeViewModel.changeVersionAndWorld()
    expect(socket.emit).toHaveBeenCalledWith('change', { version: 'version 2', world: 'world 4' })
  })
  it('should not retain selected version and world when previously selected are gone', () => {
    changeViewModel.state = state
    changeViewModel.selectVersionAndWorld(JSON.stringify({ version: 'version 2', world: 'world 4' }))
    changeViewModel.state = {
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
    }
    changeViewModel.changeVersionAndWorld()
    expect(socket.emit).toHaveBeenCalledWith('change', { version: 'version 1', world: 'world 1' })
  })
  it('should not retain selected world when previously selected is gone', () => {
    changeViewModel.state = state
    changeViewModel.selectVersionAndWorld(JSON.stringify({ version: 'version 1', world: 'world 2' }))
    changeViewModel.state = {
      versions: {
        'version 1': {
          worlds: [
            'world 1'
          ],
          world: 'world 1'
        }
      },
      version: 'version 1'
    }
    changeViewModel.changeVersionAndWorld()
    expect(socket.emit).toHaveBeenCalledWith('change', { version: 'version 1', world: 'world 1' })
  })
  it('should change version and world', () => {
    changeViewModel.selectVersionAndWorld(JSON.stringify({ version: 'version 1', world: 'world 1' }))
    changeViewModel.changeVersionAndWorld()
    expect(socket.emit).toHaveBeenCalledWith('change', { version: 'version 1', world: 'world 1' })
  })
  it('should disable select when busy', () => {
    changeViewModel.state = { ...state, ...{ busy: true } }
    expect(changeViewModel.versionAndWorldSelectDisabled).toBe(true)
  })
  it('should disable change button when busy', () => {
    changeViewModel.state = { ...state, ...{ busy: true } }
    expect(changeViewModel.changeButtonDisabled).toBe(true)
  })
  it('should disable change button when selected is current', () => {
    changeViewModel.state = state
    expect(changeViewModel.changeButtonDisabled).toBe(true)
  })
  it('should enable change button when selected world is not current', () => {
    changeViewModel.state = state
    changeViewModel.selectVersionAndWorld(JSON.stringify({ version: 'version 1', world: 'world 2' }))
    expect(changeViewModel.changeButtonDisabled).toBe(false)
  })
  it('should enable change button when selected version is not current', () => {
    changeViewModel.state = state
    changeViewModel.selectVersionAndWorld(JSON.stringify({ version: 'version 2', world: 'world 3' }))
    expect(changeViewModel.changeButtonDisabled).toBe(false)
  })
  it('should disable change button when no versions or worlds loaded', () => {
    expect(changeViewModel.changeButtonDisabled).toBe(true)
  })
})
