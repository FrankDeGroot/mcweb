'use strict'

const { UpdateViewModel } = require('../../public/update/update_view_model')

const handlers = {
  onUpdateVersion: jest.fn()
}

const state = {
  busy: false
}

describe('WorldsViewModel', () => {
  const updateViewModel = new UpdateViewModel(handlers)
  beforeEach(() => {
    updateViewModel.setCurrent(state)
  })
  it('should update version', () => {
    updateViewModel.updateVersion('release')
    expect(handlers.onUpdateVersion).toHaveBeenCalledWith('release')
  })
  it('should not update version that cannot be updated', () => {
    updateViewModel.currentVersion = 'a'
    updateViewModel.updateVersion()
    expect(handlers.onUpdateVersion).not.toHaveBeenCalledWith('a')
  })
  it('should not disable buttons when not busy', () => {
    expect(updateViewModel.updateReleaseButtonDisabled).toBe(false)
    expect(updateViewModel.updateSnapshotButtonDisabled).toBe(false)
  })
  it('should disable buttons when busy', () => {
    updateViewModel.setCurrent({ busy: true })
    expect(updateViewModel.updateReleaseButtonDisabled).toBe(true)
    expect(updateViewModel.updateSnapshotButtonDisabled).toBe(true)
  })
})
