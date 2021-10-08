import { getStream } from './get_stream.js'

export async function getJson(url) {
	const buffer = await getBuffer(url)
	return JSON.parse(buffer.toString())
}

async function getBuffer(url) {
	const response = await getStream(url)
	return new Promise((resolve, reject) => {
		const chunks = []
		response
			.on('data', chunk => chunks.push(chunk))
			.on('end', () => resolve(Buffer.concat(chunks)))
			.on('error', err => reject(err))
	})
}
