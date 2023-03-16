import { afterEach, beforeAll, beforeEach, describe, expect, test } from "bun:test"
import { ensureCurrentPath, getCurrentVersion, onCurrentPathChanged, onCurrentPathChanging } from "./current_path.js"
import { maybeLStat } from "../../lib/exists.js"
import { readlink } from "fs/promises"
import fakeManifestServer, { fake1Version, fake2Version } from "../manifest/fake_server.js"
import fakePath from "./fake_path.js"

let changingHandlerCalled = false
let changedHandlerCalled = false

beforeAll(() => {
  onCurrentPathChanging(async () => {
    changingHandlerCalled = true
  })
  onCurrentPathChanged(async () => {
    changedHandlerCalled = true
  })
})

beforeEach(async () => {
  fakePath.before()
  fakeManifestServer.before()
  changingHandlerCalled = false
  changedHandlerCalled = false
})

afterEach(async () => {
  fakeManifestServer.after()
  fakePath.after()
})

describe("ensureCurrentPath", () => {
  test("should create link to specified version", async () => {
    const currentPath = await ensureCurrentPath(fake1Version)
    expect((await maybeLStat(currentPath))?.isSymbolicLink()).toBe(true)
    expect(await readlink(currentPath)).toBe(fake1Version)
  })

  test("should not call change handler when already same current version", async () => {
    await ensureCurrentPath(fake1Version)
    await ensureCurrentPath(fake1Version)
    expect(changingHandlerCalled).toBe(false)
    expect(changedHandlerCalled).toBe(false)
  })
  test("should call change handler when already different current version", async () => {
    await ensureCurrentPath(fake1Version)
    await ensureCurrentPath(fake2Version)
    expect(changingHandlerCalled).toBe(true)
    expect(changedHandlerCalled).toBe(true)
    expect(getCurrentVersion()).toBe(fake2Version)
  })
})

