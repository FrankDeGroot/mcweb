import { join } from "$std/path/mod.ts";
import { getMcPath } from "$config/config.ts";

const { mkdir, readDir, writeTextFile } = Deno;

const commonFiles: { [_: string]: string } = {
  "banned-ips.json": "[]",
  "banned-players.json": "[]",
  "eula.txt": "eula=true",
  "ops.json": "[]",
  "server.properties": "",
  "usercache.json": "[]",
  "usernamecache.json": "[]",
  "whitelist.json": "[]",
};

export function getCommonPath() {
  return join(getMcPath(), "common");
}

/**
 * Ensure the base directory exists and create it if necessary.
 */
export async function ensureBasePath() {
  await mkdir(getMcPath(), { recursive: true });
  await ensureCommon();
}

async function ensureCommon() {
  const commonPath = getCommonPath();
  await mkdir(commonPath, { recursive: true });
  await mkdir(join(commonPath, "logs"), { recursive: true });
  const fileSet = await dirSet(getCommonPath());
  for (const file in commonFiles) {
    if (!fileSet.has(file)) {
      const filePath = join(getCommonPath(), file);
      await writeTextFile(filePath, commonFiles[file]);
    }
  }
}

async function dirSet(path: string) {
  const fileSet = new Set<string>();
  for await (const dirEntry of readDir(path)) {
    fileSet.add(dirEntry.name);
  }
  return fileSet;
}
