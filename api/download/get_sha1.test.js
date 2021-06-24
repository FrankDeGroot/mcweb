'use strict'

jest.mock('crypto')
jest.mock('./pipe')

const { createHash } = require('crypto')
const { pipe } = require('./pipe')

const { getSha1 } = require('./get_sha1')

const hash = {
  digest: jest.fn()
}
const digest = {}
const readableStream = {}

describe('getSha1', () => {
  it('computes the SHA1 hex digest of a readable stream', async () => {
    createHash.mockReturnValue(hash)
    pipe.mockResolvedValue(undefined)
    hash.digest.mockReturnValue(digest)

    await expect(getSha1(readableStream)).resolves.toEqual(digest)

    expect(createHash).toHaveBeenCalledWith('sha1')
    expect(pipe).toHaveBeenCalledWith(readableStream, hash)
    expect(hash.digest).toHaveBeenCalledWith('hex')
  })
})
