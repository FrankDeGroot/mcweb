'use strict'

jest.mock('./get_json')

const { getJson } = require('./get_json')

const { getLatest } = require('./get_latest')

describe('getLatest', () => {
  beforeEach(() => {
    getJson
      .mockResolvedValueOnce({
        latest: {
          release: '1.2.3',
          snapshot: '2.3.4'
        },
        versions: [
          {
            id: '1.2.3',
            url: 'url123'
          },
          {
            id: '2.3.4',
            url: 'url234'
          }
        ]
      })
      .mockResolvedValueOnce({
        downloads: {
          server: {
            sha1: 'sha1server',
            url: 'urlserver'
          }
        }
      })
  })
  it('should get the server info on the latest release', async () => {
    await expect(getLatest('release')).resolves.toEqual({
      latest: '1.2.3',
      sha1: 'sha1server',
      url: 'urlserver'
    })
  })
  it('should get the server info on the latest snapshot', async () => {
    await expect(getLatest('snapshot')).resolves.toEqual({
      latest: '2.3.4',
      sha1: 'sha1server',
      url: 'urlserver'
    })
  })
})
