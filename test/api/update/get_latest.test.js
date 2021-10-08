import * as assert from 'assert/strict'
import { replaceEsm as replace, reset, verify, when } from 'testdouble'
import { versionManifestUrl } from '../../../all/config.js'

const { getJson } = await replace('../../../api/update/get_json.js')
const { getLatest } = await import('../../../api/update/get_latest.js')

export default class {
	async shouldGetLatest() {
		when(getJson(versionManifestUrl)).thenResolve({
			latest: {
				release: 'latest'
			},
			versions: [
				{
					id: 'latest',
					url: 'latestUrl'
				}
			]
		})
		when(getJson('latestUrl')).thenResolve({
			downloads: {
				server: {
					url: 'latestServerUrl',
					sha1: 'latestServerSha1'
				}
			}
		})
		assert.deepEqual(await getLatest('release'), {
			latest: 'latest',
			sha1: 'latestServerSha1',
			url: 'latestServerUrl'
		})
	}
}
