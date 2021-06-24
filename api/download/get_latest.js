'use strict'

const { getJson } = require('./get_json')
const { manifestUrl } = require('../config/config')

exports.getLatest = async version => {
  const history = await getJson(manifestUrl)
  const latest = history.latest[version]
  const latestManifestUrl = history.versions.find(entry => entry.id === latest).url
  const latestManifest = await getJson(latestManifestUrl)
  const { sha1, url } = latestManifest.downloads.server
  return { latest, sha1, url }
}
