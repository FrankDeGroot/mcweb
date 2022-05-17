import { join, relative } from "$std/path/mod.ts";
import { writableStreamFromWriter } from "$std/streams/mod.ts";
import { exists } from "$lib/exists.ts";
import {
  ensureBasePath,
  getCommonPath,
} from "$api/minecraft_server/base_path.ts";
import { getMcPath } from "$config/config.ts";
import {
  getServerUrl,
  versionExists,
} from "$api/minecraft_server/manifest_cache.ts";

export async function ensureVersionPath(version: string): Promise<void> {
  await ensureBasePath();
  const versionPath = getVersionPath(version);
  if (!exists(versionPath)) {
    if (!versionExists(version)) {
      throw new Error("Unknown version");
    }
  }
  await Deno.mkdir(versionPath, { recursive: true });
  await downloadServer(versionPath, await getServerUrl(version));
  await linkCommon(versionPath);
}

export function getVersionPath(version: string) {
  return join(getMcPath(), version);
}

async function downloadServer(versionPath: string, url: string) {
  const jarPath = join(versionPath, "server.jar");
  const serverFile = await Deno.open(jarPath, {
    create: true,
    write: true,
  });
  const serverResponse = await fetch(url);
  if (!serverResponse.body) throw new Error("Unable to download server.jar.");
  await serverResponse.body.pipeTo(writableStreamFromWriter(serverFile));
}

async function linkCommon(versionPath: string) {
  const relativePath = relative(versionPath, getCommonPath());
  for await (const dirEntry of Deno.readDir(getCommonPath())) {
    try {
      await Deno.symlink(
        join(relativePath, dirEntry.name),
        join(versionPath, dirEntry.name),
      );
    } catch (e) {
      if (!(e instanceof Deno.errors.AlreadyExists)) throw e;
    }
  }
}
