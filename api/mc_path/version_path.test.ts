import { afterEach, beforeEach, expect, test } from "bun:test"
import { ensureVersionPath } from "./version_path.js"
import { join } from "path"
import { maybeStat, maybeLStat } from "../../lib/exists.js"
import fakeManifestServer, { fake1Version } from "../manifest/fake_server.js"
import fakePath from "./fake_path.js"

beforeEach(async () => {
  fakePath.before()
  fakeManifestServer.before()
})

afterEach(async () => {
  fakeManifestServer.after()
  fakePath.after()
})

test("ensureVersionDirectory", async () => {
  const versionPath = await ensureVersionPath(fake1Version)
  expect((await maybeStat(versionPath))?.isDirectory()).toBe(true)
  const serverPath = join(versionPath, "server.jar")
  expect((await maybeStat(serverPath))?.isFile()).toBe(true)
  const eulaPath = join(versionPath, "eula.txt")
  expect((await maybeLStat(eulaPath))?.isSymbolicLink()).toBe(true)
})
