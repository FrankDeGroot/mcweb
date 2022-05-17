import { relative } from "$std/path/mod.ts";
import { exists } from "$lib/exists.ts";
import {
  ensureVersionPath,
  getVersionPath,
} from "$api/minecraft_server/version_path.ts";
import { getMcPath } from "$config/config.ts";

export function getCurrentPath() {
  return getVersionPath("current");
}

export async function ensureCurrentPath(version: string) {
  await ensureVersionPath(version);
  const currentVersionPath = relative(
    getMcPath(),
    getVersionPath(version),
  );
  if (await exists(getCurrentPath())) {
    await Deno.remove(getCurrentPath());
  }
  await Deno.symlink(currentVersionPath, getCurrentPath());
}
