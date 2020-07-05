jest.mock('fs')

describe('readServerProperties', () => {
	beforeEach(() => {
		require('fs')._readFile = (path, encoding) => {
			expect(path).toBe('../server/common/server.properties')
			expect(encoding).toBe('utf8')
			return new Promise((resolve, reject) => resolve('property1=value\nproperty2=value=value'))
		}
	})
  test('', async () => {
		const { readServerProperties } = require('./mcproperties')
  	expect(await readServerProperties()).toStrictEqual({
  		property1: 'value',
  		property2: 'value=value'
  	})
  })
})
