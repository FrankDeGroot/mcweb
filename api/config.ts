import { dirname, join } from "$std/path/mod.ts";

export function getManifestUrl() {
  return "https://launchermeta.mojang.com/mc/game/version_manifest.json";
}

export function getMcPath() {
  return join(dirname(new URL(import.meta.url).pathname), "..", "mc");
}
