'use strict'

global.console.trace = jest.fn()
global.console.info = jest.fn()
global.console.warn = jest.fn()
global.console.error = jest.fn()

const { level, log, trace, info, warn, error } = require('./log')

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
    level('warn')
    info('test')
    expect(global.console.info.mock.calls.length).toBe(0)
  })
})

describe('warn', () => {
  beforeEach(() => {
    global.console.warn.mockReset()
  })
  it('should log when level set to trace', () => {
    level('trace')
    warn('test')
    expect(global.console.warn.mock.calls.length).toBe(1)
  })
  it('should log when level set to trace', () => {
    level('trace')
    log('warn', 'test')
    expect(global.console.warn.mock.calls.length).toBe(1)
  })
  it('should not log when level set to warn', () => {
    level('error')
    warn('test')
    expect(global.console.warn.mock.calls.length).toBe(0)
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
