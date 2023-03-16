import { ensureBasePath, ensureCommonPath } from "./base_path.js"
import { getServerUrl, versionExists } from "../manifest/cache.js"
import { join, relative } from "path"
import { maybeStat } from "../../lib/exists.js"
import { mkdir, readdir, symlink } from "fs/promises"
import { write } from "bun"

export async function ensureVersionPath(version: string): Promise<string> {
  if (!await versionExists(version)) throw new Error("Unknown version")
  const basePath = await ensureBasePath()
  const versionPath = join(basePath, version)
  if (!await maybeStat(versionPath)) {
    await mkdir(versionPath, { recursive: true })
    await write(join(versionPath, "server.jar"), await fetch(await getServerUrl(version)))
    await linkCommon(versionPath)
  }
  return join(basePath, version)
}

async function linkCommon(versionPath: string) {
  const commonPath = await ensureCommonPath()
  const relativePath = relative(versionPath, commonPath)
  for (const dirEntry of await readdir(commonPath)) {
    try {
      await symlink(
        join(relativePath, dirEntry),
        join(versionPath, dirEntry),
      )
    } catch (e: any) {
      if (e?.name !== "ENOENT") throw e
    }
  }
}
