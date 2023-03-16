import { buildFakeServer } from "../../fake/build.js"
import { file, serve, Server } from "bun"
import { maybeStat } from "../../lib/exists.js"
import config from "./config.js"

let server: Server | null = null

export const fake1Version = "fake1"
export const fake2Version = "fake2"
const manifestPath = "/version_manifest.json"

export default {
	before() {
		const port = 1024
		const basePath = `http://localhost:${port}/`
		config.manifestUrl = `${basePath}${manifestPath}`
		server = serve({
			port,
			async fetch(request: Request) {
				const path = new URL(request.url).pathname
				switch (path) {
					case manifestPath:
						return new Response(JSON.stringify({
							latest: {
								release: fake1Version,
								snapshot: fake2Version,
							},
							versions: [
								{
									id: fake1Version,
									url: `${basePath}${fake1Version}.json`,
								},
								{
									id: fake2Version,
									url: `${basePath}${fake2Version}.json`,
								},
							],
						}))
					case `/${fake1Version}.json`:
					case `/${fake2Version}.json`:
						return new Response(JSON.stringify({
							downloads: {
								server: {
									url: `${basePath}server.jar`,
								},
							},
						}))
					case "/server.jar":
						const fakePath = "fake/out/server.jar";
						if (!await maybeStat(fakePath)) await buildFakeServer()
						return new Response(file(fakePath))
					default:
						throw new Error(
							`Unexpected path '${path}' used when reading manifests`,
						)
				}
			}
		})
	},
	after() {
		server?.stop()
	}
}