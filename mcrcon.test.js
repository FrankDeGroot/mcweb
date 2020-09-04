'use strict'

jest.mock('rcon')

jest.mock('./log')
jest.mock('./sleep')
jest.mock('./mcproperties')

const Rcon = require('rcon')
const con = {
	on: jest.fn(),
	connect: jest.fn(),
	disconnect: jest.fn(),
	send: jest.fn(),
}

const { info, trace } = require('./log')
const { sleep } = require('./sleep')
const { readServerProperties } = require('./mcproperties')

const PORT = 123
const PASSWORD = 'password'

const { say } = require('./mcrcon')

describe('say', () => {
	const handlers = {}

	beforeEach(() => {
		readServerProperties
			.mockReset()
			.mockResolvedValue({ 'rcon.port': PORT, 'rcon.password': PASSWORD })
		Rcon
			.mockReset()
			.mockReturnValue(con)
		con.on
			.mockReset()
			.mockImplementation((event, handler) => {
				handlers[event] = handler
				return con
			})
		con.connect.mockReset()
		info.mockReset()
		trace.mockReset()
		sleep.mockReset()
	})
	it('should resolve when sent successfully', async () => {
		con.connect.mockImplementation(() => {
			handlers.auth()
			handlers.response('response')
			handlers.end()
		})

		await say('hello')

		expect(Rcon).toHaveBeenCalledWith('localhost', PORT, PASSWORD, {
			tcp: true,
			challenge: false
		})
		expect(con.on).toHaveBeenCalled()
		expect(con.connect).toHaveBeenCalled()
		expect(con.send).toHaveBeenCalledWith('say hello')
		expect(con.disconnect).toHaveBeenCalled()

		expect(info).toHaveBeenCalledWith('rcon response', 'response')
	})
})
