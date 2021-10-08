import { getJson } from './get_json.js'
import { versionManifestUrl } from '../../all/config.js'

export async function getLatest(version) {
	const history = await getJson(versionManifestUrl)
	const latest = history.latest[version]
	const latestManifestUrl = history.versions.find(entry => entry.id === latest).url
	const latestManifest = await getJson(latestManifestUrl)
	const { sha1, url } = latestManifest.downloads.server
	return { latest, sha1, url }
}
