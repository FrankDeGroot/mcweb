'use strict'

const { getJson } = require('./get_json')

exports.getLatest = async version => {
  const history = await getJson('https://launchermeta.mojang.com/mc/game/version_manifest.json')
  const latest = history.latest[version]
  const latestManifestUrl = history.versions.find(entry => entry.id === latest).url
  const latestManifest = await getJson(latestManifestUrl)
  const { sha1, url } = latestManifest.downloads.server
  return { latest, sha1, url }
}
