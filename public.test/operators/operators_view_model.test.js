'use strict'

const { OperatorsViewModel } = require('../../public/operators/operators_view_model')

const socket = {
  emit: jest.fn()
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
    operatorsViewModel = new OperatorsViewModel(socket, changeScheduler)
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
  it('should retain selected operator after reload', () => {
    operatorsViewModel.setCurrent({
      operators
    })
    operatorsViewModel.select('2')
    operatorsViewModel.setCurrent({
      operators
    })
    expect(operatorsViewModel.operators).toStrictEqual([{
      label: 'ops 1',
      selected: false,
      value: '1'
    }, {
      label: 'ops 2',
      selected: true,
      value: '2'
    }])
  })
  it('should not retain selected operator when removed after reload', () => {
    operatorsViewModel.setCurrent({
      operators
    })
    operatorsViewModel.select('2')
    operatorsViewModel.setCurrent({
      operators: [{
        uuid: '1',
        name: 'ops 1',
        level: 0,
        bypassesPlayerLimit: false
      }]
    })
    expect(operatorsViewModel.operators).toStrictEqual([{
      label: 'ops 1',
      selected: true,
      value: '1'
    }])
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
  it('should enable controls when not busy', () => {
    operatorsViewModel.setCurrent({ operators, busy: false })
    expect(operatorsViewModel.operatorSelectDisabled).toBe(false)
    expect(operatorsViewModel.bypassesPlayerLimitCheckboxDisabled).toBe(false)
    expect(operatorsViewModel.levelRadioDisabled).toBe(false)
  })
  it('should disable controls when busy', () => {
    operatorsViewModel.setCurrent({ operators, busy: true })
    expect(operatorsViewModel.operatorSelectDisabled).toBe(true)
    expect(operatorsViewModel.bypassesPlayerLimitCheckboxDisabled).toBe(true)
    expect(operatorsViewModel.levelRadioDisabled).toBe(true)
  })
})
