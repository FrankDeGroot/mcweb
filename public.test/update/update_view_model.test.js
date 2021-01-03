'use strict'

const { UpdateViewModel } = require('../../public/update/update_view_model')

const handlers = {
  onUpdateVersion: jest.fn()
}

describe('WorldsViewModel', () => {
  const updateViewModel = new UpdateViewModel(handlers)
  it('should update version', () => {
    updateViewModel.updateVersion('release')
    expect(handlers.onUpdateVersion).toHaveBeenCalledWith('release')
  })
  it('should not update version that cannot be updated', () => {
    updateViewModel.currentVersion = 'a'
    updateViewModel.updateVersion()
    expect(handlers.onUpdateVersion).not.toHaveBeenCalledWith('a')
  })
})
