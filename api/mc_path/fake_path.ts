import { join } from "path"
import { mkdtemp, rm } from "fs/promises"
import { tmpdir } from "os"
import config from "./config.js"

export default {
	async before() {
		config.basePath = await mkdtemp(join(tmpdir(), "mc"))
	},
	async after() {
		await rm(config.basePath, { recursive: true })
	}
}