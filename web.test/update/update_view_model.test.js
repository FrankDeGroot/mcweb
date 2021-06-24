'use strict'

const { UpdateViewModel } = require('../../web/update/update_view_model')

const socket = {
  emit: jest.fn()
}

const state = {
  busy: false
}

describe('WorldsViewModel', () => {
  const updateViewModel = new UpdateViewModel(socket)
  beforeEach(() => {
    updateViewModel.state = state
    socket.emit.mockReset()
  })
  it('should update version', () => {
    updateViewModel.updateVersion('release')
    expect(socket.emit).toHaveBeenCalledWith('update', { version: 'release' })
  })
  it('should not update version that cannot be updated', () => {
    updateViewModel.currentVersion = 'a'
    updateViewModel.updateVersion()
    expect(socket.emit).not.toHaveBeenCalled()
  })
  it('should not disable buttons when not busy', () => {
    expect(updateViewModel.updateReleaseButtonDisabled).toBe(false)
    expect(updateViewModel.updateSnapshotButtonDisabled).toBe(false)
  })
  it('should disable buttons when busy', () => {
    updateViewModel.state = { busy: true }
    expect(updateViewModel.updateReleaseButtonDisabled).toBe(true)
    expect(updateViewModel.updateSnapshotButtonDisabled).toBe(true)
  })
})
