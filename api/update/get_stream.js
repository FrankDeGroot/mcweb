import { get } from 'https'

export async function getStream(url) {
	return new Promise((resolve, reject) => {
		get(url, res => {
			if (res.statusCode === 200) {
				resolve(res)
			} else {
				reject(new Error(`GET ${url} returned ${res.statusCode}`))
			}
		})
	})
}
