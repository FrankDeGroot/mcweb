'use strict'

jest.mock('fs')

const { readlink } = require('fs').promises
const { currentVersion, currentWorld } = require('./mcget')

const CURRENT = 'current'

describe('currentVersion', () => {
	beforeEach(() => {
		readlink.mockReset()
	})
 	it('reads current', async () => {
		readlink.mockResolvedValue(CURRENT)
 		expect(await currentVersion()).toBe(CURRENT)
		expect(readlink.mock.calls[0][0]).toBe('../server/current')
 	})
	it('throws notFound if path does not exist', async () => {
		readlink.mockRejectedValue({ code: 'ENOENT' })
		await expect(currentVersion).rejects.toEqual({ code: 'NOTFOUND', message: 'Unknown path' })
	})
})

describe('currentWorld', () => {
	beforeEach(() => {
		readlink.mockReset()
	})
	it('reads current', async () => {
		readlink.mockResolvedValue(CURRENT)
		expect(await currentWorld('version')).toBe(CURRENT)
		expect(readlink.mock.calls[0][0]).toBe('../server/version/world')
	})
	it('throws notFound if path does not exist', async () => {
		readlink.mockRejectedValue({ code: 'ENOENT' })
		await expect(currentWorld('version')).rejects.toEqual({ code: 'NOTFOUND', message: 'Unknown path' })
	})
})
