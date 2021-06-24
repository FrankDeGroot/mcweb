'use strict'

global.console.trace = jest.fn()
global.console.info = jest.fn()
global.console.warning = jest.fn()
global.console.error = jest.fn()

const { level, log, trace, info, warning, error } = require('./log')

describe('trace', () => {
  beforeEach(() => {
    global.console.trace.mockReset()
  })
  it('should log when level set to trace', () => {
    level('trace')
    trace('test')
    expect(global.console.trace.mock.calls.length).toBe(1)
  })
  it('should log when level set to trace', () => {
    level('trace')
    log('trace', 'test')
    expect(global.console.trace.mock.calls.length).toBe(1)
  })
  it('should not log when level set to info', () => {
    level('info')
    trace('test')
    expect(global.console.trace.mock.calls.length).toBe(0)
  })
})

describe('info', () => {
  beforeEach(() => {
    global.console.info.mockReset()
  })
  it('should log when level set to trace', () => {
    level('trace')
    info('test')
    expect(global.console.info.mock.calls.length).toBe(1)
  })
  it('should log when level set to trace', () => {
    level('trace')
    log('info', 'test')
    expect(global.console.info.mock.calls.length).toBe(1)
  })
  it('should not log when level set to info', () => {
    level('warning')
    info('test')
    expect(global.console.info.mock.calls.length).toBe(0)
  })
})

describe('warning', () => {
  beforeEach(() => {
    global.console.warning.mockReset()
  })
  it('should log when level set to trace', () => {
    level('trace')
    warning('test')
    expect(global.console.warning.mock.calls.length).toBe(1)
  })
  it('should log when level set to trace', () => {
    level('trace')
    log('warning', 'test')
    expect(global.console.warning.mock.calls.length).toBe(1)
  })
  it('should not log when level set to warning', () => {
    level('error')
    warning('test')
    expect(global.console.warning.mock.calls.length).toBe(0)
  })
})

describe('error', () => {
  beforeEach(() => {
    global.console.error.mockReset()
  })
  it('should log when level set to trace', () => {
    level('trace')
    error('test')
    expect(global.console.error.mock.calls.length).toBe(1)
  })
  it('should log when level set to trace', () => {
    level('trace')
    log('error', 'test')
    expect(global.console.error.mock.calls.length).toBe(1)
  })
})
