import config from "./config.js"

export type Version = "release" | "snapshot" | string

export async function getRelease() {
  await ensureManifest()
  return release as string
}

export async function getSnapshot() {
  await ensureManifest()
  return snapshot as string
}

/**
 * Get URL to server.jar for a given version.
 * @param version Minecraft version for which to get the server.jar URL.
 */
export async function getServerUrl(version: Version) {
  const url = (await getVersionMap())[version]
  const response = await fetch(url)
  const json = await response.json() as {
    downloads: {
      server: {
        url: string
      }
    }
  }
  return json.downloads.server.url
}

/**
 * Check if a given Minecraft version is listed in the manifest.
 * @param version Minecraft version to check.
 */
export async function versionExists(version: string) {
  const versionMap = await getVersionMap()
  return !!versionMap[version]
}

export async function getVersions() {
  return await getVersionList()
}

type ManifestVersion = {
  id: string
  url: string
}

type Manifest = {
  latest: {
    release: string,
    snapshot: string,
  }
  versions: ManifestVersion[]
}

type VersionMap = { [_: string]: string }

let versionMap: VersionMap | null = null
let versionList: string[] | null = null
let release: string | null = null;
let snapshot: string | null = null;

async function getVersionMap() {
  await ensureManifest()
  return versionMap as VersionMap
}

async function getVersionList() {
  await ensureManifest()
  return versionList as string[]
}

async function ensureManifest() {
  if (versionMap === null) {
    const response = await fetch(config.manifestUrl)
    const manifest = await response.json() as Manifest
    release = manifest.latest.release
    snapshot = manifest.latest.snapshot
    versionMap = extractVersionMap(manifest)
    versionList = manifest.versions.map(({ id }) => id)
  }
}

function extractVersionMap(manifest: Manifest) {
  const versions: VersionMap = {}
  for (const { id, url } of manifest.versions) {
    versions[id] = url
  }
  return versions
}
