import { afterEach, beforeEach, expect, test } from "bun:test"
import { ensureBasePath, ensureCommonPath } from "./base_path.js"
import { join } from "path"
import { readFile, stat } from "fs/promises"
import { write } from "bun"
import fakePath from "./fake_path.js"

beforeEach(async () => {
  fakePath.before()
})

afterEach(async () => {
  fakePath.after()
})

test("ensureBasePath", async () => {
  const basePath = await ensureBasePath()
  const mcDirStat = await stat(basePath)
  expect(mcDirStat.isDirectory()).toBe(true)
})

test("ensureCommonPath", async () => {
  const commonPath = await ensureCommonPath()
  const eulaPath = join(commonPath, "eula.txt")
  const eulaFileStat = await stat(eulaPath)
  expect(eulaFileStat.isFile()).toBe(true)
  const eula = await readFile(eulaPath, "utf-8")
  expect(eula).toBe("eula=true")

  await write(eulaPath, "eula=false")
  await ensureCommonPath()
  const overwrittenEula = await readFile(eulaPath, "utf-8")
  expect(overwrittenEula).toBe("eula=false")
})