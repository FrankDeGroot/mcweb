'use strict'

const { OperatorsViewModel } = require('../../public/operators/operators_view_model')

const handlers = {
}

const changeScheduler = {
  schedule: jest.fn()
}

const operators = [{
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

describe('OperatorsViewModel', () => {
  let operatorsViewModel
  beforeEach(() => {
    operatorsViewModel = new OperatorsViewModel(handlers, changeScheduler)
    changeScheduler.schedule.mockReset()
  })
  it('should initialize properly', () => {
    expect(operatorsViewModel.operators).toStrictEqual([])
    expect(operatorsViewModel.bypassesPlayerLimit).toBe(null)
    expect(operatorsViewModel.level).toBe(null)
  })
  it('should load operators and select the first as default', () => {
    operatorsViewModel.setCurrent({
      operators
    })
    expect(changeScheduler.schedule).toHaveBeenCalled()
    expect(operatorsViewModel.operators).toStrictEqual([{
      label: 'ops 1',
      selected: true,
      value: '1'
    }, {
      label: 'ops 2',
      selected: false,
      value: '2'
    }])
    expect(operatorsViewModel.bypassesPlayerLimit).toBe(false)
  })
  it('should select operator and expose its properties', () => {
    operatorsViewModel.setCurrent({
      operators
    })
    operatorsViewModel.select('1')
    expect(changeScheduler.schedule).toHaveBeenCalled()
    expect(operatorsViewModel.bypassesPlayerLimit).toBe(false)
    expect(operatorsViewModel.level).toBe('0')
  })
  it('should update operator property `Bypasses Player Limit`', () => {
    operatorsViewModel.setCurrent({
      operators
    })
    operatorsViewModel.select('1')
    operatorsViewModel.bypassesPlayerLimit = true
    expect(operatorsViewModel.bypassesPlayerLimit).toBe(true)
    expect(changeScheduler.schedule).toHaveBeenCalled()
  })
  it('should update operator property `Level`', () => {
    operatorsViewModel.setCurrent({
      operators
    })
    operatorsViewModel.select('1')
    operatorsViewModel.level = 3
    expect(operatorsViewModel.level).toBe('3')
    expect(changeScheduler.schedule).toHaveBeenCalled()
  })
})
