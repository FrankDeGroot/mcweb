import { afterEach, beforeEach, expect, test } from "bun:test"
import { getRelease, getServerUrl, getSnapshot, getVersions, versionExists } from "./cache.js"
import fakeManifestServer, { fake1Version, fake2Version } from "./fake_server.js"

beforeEach(async () => {
  fakeManifestServer.before();
})

afterEach(async () => {
  fakeManifestServer.after();
})

test("versionExists", async () => {
  expect(await versionExists(fake1Version)).toBe(true)
  expect(await versionExists("not")).toBe(false)
})

test("getVersions", async () => {
  expect(await getVersions()).toEqual([fake1Version, fake2Version])
})

test("getRelease", async () => {
  expect(await getRelease()).toEqual(fake1Version)
})

test("getSnapshot", async () => {
  expect(await getSnapshot()).toEqual(fake2Version)
})

test("getServerUrl", async () => {
  expect(await getServerUrl(fake1Version)).toBe("http://localhost:1024/server.jar")
})