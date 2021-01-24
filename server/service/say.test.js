'use strict'

jest.mock('./rcon')
jest.mock('../utils/log')
jest.mock('../utils/sleep')

const { send } = require('./rcon')
const { sleep } = require('../utils/sleep')

const { say } = require('./say')

describe('say', () => {
  const message = 'message'
  const response = 'response'
  const error = new Error()
  error.code = 'ECONNREFUSED'
  beforeEach(() => {
    send.mockReset()
    sleep.mockReset()
  })
  it('should return response when sent succesfully', async () => {
    send.mockResolvedValue(response)

    await expect(say(message)).resolves.toBe(response)
  })
  it('should retry when not sent succesfully', async () => {
    send
      .mockRejectedValueOnce(error)
      .mockResolvedValue(response)

    await expect(say(message)).resolves.toBe(response)

    expect(sleep).toHaveBeenCalledWith(1000)
  })
  it('should fail after 120 retries fail', async () => {
    send.mockRejectedValue(error)

    await expect(say(message)).rejects.toStrictEqual(new Error('Server failed to restart'))

    expect(send).toHaveBeenCalledTimes(120)
    expect(sleep).toHaveBeenCalledTimes(120)
  })
})
