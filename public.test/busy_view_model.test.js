'use strict'

const { BusyViewModel } = require('../public/busy_view_model')

const changeScheduler = {
  schedule: jest.fn()
}

describe('BusyViewModel', () => {
  let busyViewModel
  beforeEach(() => {
    busyViewModel = new BusyViewModel(changeScheduler)
    changeScheduler.schedule.mockReset()
  })
  it('should initialize properly', () => {
    expect(busyViewModel.busy).toBe(false)
  })
  it('should set busy', () => {
    busyViewModel.setCurrent({ busy: true })
    expect(busyViewModel.busy).toBe(true)
    expect(changeScheduler.schedule).toHaveBeenCalled()
  })
})
