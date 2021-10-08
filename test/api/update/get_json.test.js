import * as assert from 'assert/strict'
import { readFile } from 'fs/promises'
import { createServer } from 'https'

import { getJson } from '../../../api/update/get_json.js'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

const json = { 'a': 1 }
const port = 2048
const options = {
	key: await readFile('../../key.pem'),
	cert: await readFile('../../cert.pem')
}

export default class {
	#server
	async before() {
		return new Promise((resolve, reject) => {
			this.#server = createServer(options).listen(port, () => resolve())
		})
	}
	async after() {
		return new Promise((resolve, reject) =>
			this.#server.close(err => err ? reject(err) : resolve()))
	}
	async shouldGetJson() {
		this.#server.on('request', (req, res) => {
			assert.equal(req.url, '/test')
			res.write(JSON.stringify(json))
			res.end()
		})
		assert.deepEqual(await getJson(`https://localhost:${port}/test`), json)
	}
	async shouldRejectOnNoOKResponse() {
		this.#server.on('request', (req, res) => {
			res.statusCode = 500
			res.end()
		})
		await assert.rejects(() => getJson(`https://localhost:${port}`))
	}
}
