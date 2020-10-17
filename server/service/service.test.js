'use strict'

jest.mock('child_process')
jest.mock('../utils/log')

const { spawn } = require('child_process')
const childProcess = {
  on: jest.fn(),
  stdout: {
    on: jest.fn()
  },
  stderr: {
    on: jest.fn()
  }
}

const { error, info } = require('../utils/log')

const { start } = require('./service')

describe('start', () => {
  const childProcessHandlers = {}
  const stdOutHandlers = {}
  const stdErrHandlers = {}

  beforeEach(() => {
    spawn.mockReset().mockReturnValue(childProcess)
    childProcess.on
      .mockReset()
      .mockImplementation((event, handler) => {
        childProcessHandlers[event] = handler
        return childProcess
      })
    childProcess.stdout.on
      .mockReset()
      .mockImplementation((event, handler) => {
        stdOutHandlers[event] = handler
        return stdOutHandlers
      })
    childProcess.stderr.on
      .mockReset()
      .mockImplementation((event, handler) => {
        stdErrHandlers[event] = handler
        return stdErrHandlers
      })
    error.mockReset()
    info.mockReset()
  })
  it('should resolve when closed with 0 error code', async () => {
    const promise = start()
    childProcessHandlers.close(0)
    await promise

    expect(info.mock.calls.length).toBe(1)
    expect(error.mock.calls.length).toBe(0)
  })
  it('should reject when closed with nonzero error code', async () => {
    const promise = start()
    childProcessHandlers.close(1)

    await expect(promise).rejects.toEqual(1)

    expect(info.mock.calls.length).toBe(1)
    expect(error.mock.calls.length).toBe(0)
  })
  it('should reject on error', async () => {
    const ERR = {}
    const promise = start()
    childProcessHandlers.error(ERR)

    await expect(promise).rejects.toEqual(ERR)

    expect(info.mock.calls.length).toBe(0)
    expect(error.mock.calls.length).toBe(1)
  })
  it('should redirect stdout to info', async () => {
    const promise = start()
    stdOutHandlers.data('data')
    childProcessHandlers.close(0)

    await promise

    expect(info.mock.calls.length).toBe(2)
    expect(error.mock.calls.length).toBe(0)
  })
  it('should redirect stderr to error', async () => {
    const promise = start()
    stdErrHandlers.data('data')
    childProcessHandlers.close(0)

    await promise

    expect(info.mock.calls.length).toBe(1)
    expect(error.mock.calls.length).toBe(1)
  })
})
