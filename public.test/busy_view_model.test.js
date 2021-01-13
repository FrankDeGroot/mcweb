'use strict'

const { BusyViewModel } = require('../public/busy_view_model')

const handlers = {
  onReady: jest.fn()
}

const changeScheduler = {
  schedule: jest.fn()
}

describe('BusyViewModel', () => {
  let busyViewModel
  beforeEach(() => {
    busyViewModel = new BusyViewModel(handlers, changeScheduler)
    changeScheduler.schedule.mockReset()
  })
  it('should initialize properly', () => {
    expect(busyViewModel.busy).toBe(false)
  })
  it('should set busy', () => {
    busyViewModel.busy = true
    expect(changeScheduler.schedule).toHaveBeenCalled()
  })
  it('should clear busy and raise onReady', () => {
    busyViewModel.busy = true
    busyViewModel.busy = false
    expect(handlers.onReady).toHaveBeenCalled()
    expect(changeScheduler.schedule).toHaveBeenCalled()
  })
})
