import { ensureBasePath } from "./base_path.js"
import { ensureVersionPath } from "./version_path.js"
import { join, relative } from "path"
import { maybeLStat } from "../../lib/exists.js"
import { readlink, rm, symlink } from "fs/promises"
import { AsyncEvent } from "../../lib/async_event.js"

export type CurrentPathChangeHandler = () => Promise<void>

let currentPathChangingHandler = new AsyncEvent<never>()
let currentPathChangedHandler = new AsyncEvent<never>()
let currentVersion: string | null = null

export function onCurrentPathChanging(changingHandler: CurrentPathChangeHandler) {
  currentPathChangingHandler.on(changingHandler)
}

export function onCurrentPathChanged(changedHandler: CurrentPathChangeHandler) {
  currentPathChangedHandler.on(changedHandler)
}

export function getCurrentVersion() {
  return currentVersion
}

export async function ensureCurrentPath(version: string) {
  const basePath = await ensureBasePath()
  const currentPath = join(basePath, "current")
  const currentVersionPath = relative(
    basePath,
    await ensureVersionPath(version),
  )
  const exists = await maybeLStat(currentPath)
  const changing = exists && await readlink(currentPath) !== version
  if (exists) {
    changing && currentPathChangingHandler.emit()
    await rm(currentPath)
  }
  await symlink(currentVersionPath, currentPath)
  currentVersion = version
  changing && currentPathChangedHandler.emit()
  return currentPath
}