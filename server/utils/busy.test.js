'use strict'

const { doIfNotBusy, isBusy } = require('./busy')

const action = jest.fn()
const ERROR = new Error()

describe('busy', () => {
  beforeEach(() => {
    action.mockReset()
  })
  it('should do if not busy', async () => {
    action.mockResolvedValue(true)
    expect(isBusy()).toBe(false)
    await expect(doIfNotBusy(action)).resolves.toBe(true)
    expect(action).toHaveBeenCalled()
    expect(isBusy()).toBe(false)
  })
  it('should throw error if already busy', async () => {
    action.mockImplementation(async () => {
      expect(isBusy()).toBe(true)
      await expect(doIfNotBusy(action)).rejects.toStrictEqual(new Error('Already busy'))
    })
    await doIfNotBusy(action)
    expect(action).toHaveBeenCalledTimes(1)
    expect(isBusy()).toBe(false)
  })
  it('should do if previous action throws', async () => {
    action.mockImplementationOnce(() => {
      throw ERROR
    })
    action.mockResolvedValueOnce(true)
    await expect(doIfNotBusy(action)).rejects.toBe(ERROR)
    expect(isBusy()).toBe(false)
    await expect(doIfNotBusy(action)).resolves.toBe(true)
  })
  it('should do if previous action rejects', async () => {
    action.mockRejectedValueOnce(ERROR)
    action.mockResolvedValueOnce(true)
    await expect(doIfNotBusy(action)).rejects.toBe(ERROR)
    expect(isBusy()).toBe(false)
    await expect(doIfNotBusy(action)).resolves.toBe(true)
  })
})
