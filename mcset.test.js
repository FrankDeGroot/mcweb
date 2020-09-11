'use strict'

jest.mock('fs')
jest.mock('./log')
jest.mock('./mcpaths')
jest.mock('./mcget')
jest.mock('./mcservice')
jest.mock('./mcrcon')
jest.mock('./sleep')

const { symlink, unlink } = require('fs').promises
const { info } = require('./log')
const {
	currentVersionPath,
	currentWorldPath,
	serverPath,
	versionPath,
} = require('./mcpaths')
const {
	currentVersion,
	currentWorld,
} = require('./mcget')
const { start, stop } = require('./mcservice')
const { say } = require('./mcrcon')
const { sleep } = require('./sleep')
const { badRequest } = require('./error')

const onchange = jest.fn()

const { change } = require('./mcset')

describe('change', () => {
	beforeAll(() => {
		symlink.mockReset()
		unlink.mockReset()
		info.mockReset()
		currentWorldPath.mockReset()
		versionPath.mockReset()
		currentVersion.mockReset()
		currentWorld.mockReset()
		start.mockReset()
		stop.mockReset()
		say.mockReset()
		sleep.mockReset()
	})
	it('should change version and world', async () => {
		currentVersion.mockResolvedValue('oldVersion')
		currentWorld.mockResolvedValue('newVersion')
		currentWorldPath.mockReturnValue('currentWorldPath')

		await change('newVersion', 'newWorld', onchange)

		expect(unlink).toHaveBeenCalledWith('currentVersionPath')
		expect(symlink).toHaveBeenCalledWith('newVersion', 'currentVersionPath')

		expect(currentWorldPath).toHaveBeenCalledWith('newVersion')
		expect(unlink).toHaveBeenCalledWith('currentWorldPath')
		expect(symlink).toHaveBeenCalledWith('newWorld', 'currentWorldPath')
	})
	it('should skip when version and world are already current', async () => {
		const VERSION = "Version"
		const WORLD = "World"

		currentVersion.mockResolvedValue(VERSION)
		currentWorld.mockResolvedValue(WORLD)
		
		await change(VERSION, WORLD, onchange)

		expect(onchange).toHaveBeenCalledWith('Already current')
	})
	it('should skip when already changing', async () => {
		currentVersion.mockResolvedValue('oldVersion')
		currentWorld.mockResolvedValue('newVersion')
		onchange.mockImplementationOnce(async () => {
			await expect(() =>
				change('someVersion', 'someWorld', onchange))
					.rejects.toStrictEqual({
						code: badRequest,
						message: 'Already changing version/world'
					})
		})

		await change('newVersion', 'newWorld', onchange)
	})
	it('should not skip when changing fails', async () => {
		currentVersion.mockResolvedValue('oldVersion')
		currentWorld.mockResolvedValue('newVersion')
		const ERR = {}
		onchange.mockImplementationOnce(() => {
			throw ERR
		})

		await expect(() => change('newVersion', 'newWorld', onchange)).rejects.toBe(ERR)
		await change('someVersion', 'someWorld', onchange)
	})
})
