import { createHash } from 'crypto'
import { pipe } from './pipe.js'

export async function getSha1(readableStream) {
	const hash = createHash('sha1')
	await pipe(readableStream, hash)
	return hash.digest('hex')
}
