import { getManifestUrl } from "$config/config.ts";

/**
 * Get URL to server.jar for a given version.
 * @param version Minecraft version for which to get the server.jar URL.
 */
export async function getServerUrl(version: string) {
  const url = (await getVersionMap())[version];
  const response = await fetch(url);
  const json = await response.json();
  return json.downloads.server.url;
}

/**
 * Check if a given Minecraft version is listed in the manifest.
 * @param version Minecraft version to check.
 */
export async function versionExists(version: string) {
  const versionMap = await getVersionMap();
  return !!versionMap[version];
}

export async function getVersions() {
  return await getVersionList();
}

type Version = {
  id: string;
  url: string;
};

type Manifest = {
  versions: Version[];
};

type VersionMap = { [_: string]: string };

let versionMap: VersionMap | null = null;
let versionList: [Version] | null = null;

async function getVersionMap() {
  await ensureManifest();
  return versionMap as VersionMap;
}

async function getVersionList() {
  await ensureManifest();
  return versionList as [Version];
}

async function ensureManifest() {
  if (versionMap === null) {
    const response = await fetch(getManifestUrl());
    const manifest = await response.json() as Manifest;
    versionMap = extractVersionMap(manifest);
    versionList = manifest.versions.map(({ id, url }) => ({ id, url })) as [
      Version,
    ];
  }
}

function extractVersionMap(manifest: Manifest) {
  const versions: VersionMap = {};
  for (const version of manifest.versions) {
    versions[version.id] = version.url;
  }
  return versions;
}
