'use strict'

jest.mock('../../public/scheduler')
const { Scheduler } = require('../../public/scheduler')
const { OpsViewModel } = require('../../public/ops/ops_view_model')

const handlers = {
  onChange: jest.fn()
}

const changeScheduler = {
  schedule: jest.fn()
}

const ops = [{
  uuid: '1',
  name: 'ops 1'
}, {
  uuid: '2',
  name: 'ops 2'
}]

describe('OpsViewModel', () => {
  let opsViewModel
  beforeEach(() => {
    Scheduler.mockImplementation(handler => {
      expect(handler).toBe(handlers.onChange)
      return changeScheduler
    })
    opsViewModel = new OpsViewModel(handlers)
  })
  it('should initialize properly', () => {
    expect(opsViewModel.ops).toStrictEqual([])
  })
  it('should load operators', () => {
    opsViewModel.setCurrent({
      ops: ops
    })
    expect(opsViewModel.ops).toStrictEqual([
      'ops 1',
      'ops 2'
    ])
  })
})
