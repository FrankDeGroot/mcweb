import { join } from "path"
import { mkdir, readdir } from "fs/promises"
import { write } from "bun"
import config from "./config.js"

const commonFiles: { [_: string]: string } = {
  "banned-ips.json": "[]",
  "banned-players.json": "[]",
  "eula.txt": "eula=true",
  "ops.json": "[]",
  "server.properties": "",
  "usercache.json": "[]",
  "usernamecache.json": "[]",
  "whitelist.json": "[]",
}

export async function ensureCommonPath() {
  const commonPath = join(config.basePath, "common")
  await mkdir(commonPath, { recursive: true })
  await mkdir(join(commonPath, "logs"), { recursive: true })
  const fileSet = await dirSet(commonPath)
  for (const file in commonFiles) {
    if (!fileSet.has(file)) {
      const filePath = join(commonPath, file)
      await write(filePath, commonFiles[file])
    }
  }
  return commonPath
}

/**
 * Ensure the base directory exists and create it if necessary.
 */
export async function ensureBasePath() {
  await mkdir(config.basePath, { recursive: true })
  return config.basePath
}

async function dirSet(path: string) {
  const fileSet = new Set<string>()
  for (const dirEntry of await readdir(path)) {
    fileSet.add(dirEntry)
  }
  return fileSet
}
