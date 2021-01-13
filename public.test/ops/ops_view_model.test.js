'use strict'

const { OpsViewModel } = require('../../public/ops/ops_view_model')

const handlers = {
}

const changeScheduler = {
  schedule: jest.fn()
}

const ops = [{
  uuid: '1',
  name: 'ops 1',
  level: 0,
  bypassesPlayerLimit: false
}, {
  uuid: '2',
  name: 'ops 2',
  level: 1,
  bypassesPlayerLimit: true
}]

describe('OpsViewModel', () => {
  let opsViewModel
  beforeEach(() => {
    opsViewModel = new OpsViewModel(handlers, changeScheduler)
    changeScheduler.schedule.mockReset()
  })
  it('should initialize properly', () => {
    expect(opsViewModel.ops).toStrictEqual([])
    expect(opsViewModel.bypassesPlayerLimit).toBe(null)
    expect(opsViewModel.level).toBe(null)
  })
  it('should load operators and select the first as default', () => {
    opsViewModel.setCurrent({
      ops
    })
    expect(changeScheduler.schedule).toHaveBeenCalled()
    expect(opsViewModel.ops).toStrictEqual([{
      label: 'ops 1',
      selected: true,
      value: '1'
    }, {
      label: 'ops 2',
      selected: false,
      value: '2'
    }])
    expect(opsViewModel.bypassesPlayerLimit).toBe(false)
  })
  it('should select operator and expose its properties', () => {
    opsViewModel.setCurrent({
      ops
    })
    opsViewModel.select('1')
    expect(changeScheduler.schedule).toHaveBeenCalled()
    expect(opsViewModel.bypassesPlayerLimit).toBe(false)
    expect(opsViewModel.level).toBe('0')
  })
  it('should update operator property `Bypasses Player Limit`', () => {
    opsViewModel.setCurrent({
      ops
    })
    opsViewModel.select('1')
    opsViewModel.bypassesPlayerLimit = true
    expect(opsViewModel.bypassesPlayerLimit).toBe(true)
    expect(changeScheduler.schedule).toHaveBeenCalled()
  })
  it('should update operator property `Level`', () => {
    opsViewModel.setCurrent({
      ops
    })
    opsViewModel.select('1')
    opsViewModel.level = 3
    expect(opsViewModel.level).toBe('3')
    expect(changeScheduler.schedule).toHaveBeenCalled()
  })
})
