import { describe, expect, test } from "bun:test"
import { join } from "path"
import { maybeStat, maybeLStat } from "./exists.js"
import { rm, symlink } from "fs/promises"
import { tmpdir } from "os"

describe("mayBeStat", () => {
	test("should return stat when file or directory exists", async () => {
		expect(await maybeStat(process.cwd())).not.toBeNull()
	})
	test("should return null when file or directory does not exist", async () => {
		expect(await maybeStat("goop")).toBeNull()
	})
})

describe("mayBeLStat", () => {
	test("should return stat when file or directory exists", async () => {
		const tmp = join(tmpdir(), Math.random().toString())
		await symlink(tmpdir(), tmp)
		try {
			expect((await maybeLStat(tmp))?.isSymbolicLink()).toBe(true)
		} finally {
			await rm(tmp)
		}

	})
	test("should return null when file or directory does not exist", async () => {
		expect(await maybeLStat("goop")).toBeNull()
	})
})