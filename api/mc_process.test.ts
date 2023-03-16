import { afterEach, beforeEach, expect, test } from "bun:test"
import { ensureCurrentPath } from "./mc_path/current_path.js"
import { join } from "path"
import { maybeStat } from "../lib/exists.js"
import { ServerState, ensureStarted, ensureStarting, ensureStopped, getServerState, serverStateEvent } from "./mc_process.js"
import fakeManifestServer, { fake1Version } from "./manifest/fake_server.js"
import fakePath from "./mc_path/fake_path.js"

beforeEach(async () => {
  fakePath.before()
  fakeManifestServer.before()
})

afterEach(async () => {
  fakeManifestServer.after()
  fakePath.after()
})

test("server should start and stop", async () => {
  let serverState = getServerState()
  serverStateEvent.on(async newServerState => { serverState = newServerState })
  expect(serverState).toBe(ServerState.stopped)
  await ensureStarting(fake1Version)
  expect(serverState).toBe(ServerState.starting)
  await ensureStarted(fake1Version)
  const currentPath = await ensureCurrentPath(fake1Version)
  expect(await maybeStat(join(currentPath, "NotACleanExit"))).toBeDefined()
  expect(serverState).toBe(ServerState.started)
  await ensureStopped()
  expect(serverState).toBe(ServerState.stopped)
  expect(await maybeStat(join(currentPath, "NotACleanExit"))).toBeNull()
})
