'use strict'

jest.mock('../public/scheduler')
const { Scheduler } = require('../public/scheduler')
const { BusyViewModel } = require('../public/busy_view_model')

const handlers = {
  onChange: jest.fn(),
  onReady: jest.fn()
}

const changeScheduler = {
  schedule: jest.fn()
}

describe('BusyViewModel', () => {
  let busyViewModel
  beforeEach(() => {
    Scheduler.mockImplementation(handler => {
      expect(handler).toBe(handlers.onChange)
      return changeScheduler
    })
    busyViewModel = new BusyViewModel(handlers)
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
