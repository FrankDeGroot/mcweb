import { lstat, stat } from "fs/promises"

export async function maybeStat(path: string) {
	try {
		return await stat(path)
	} catch (e: any) {
		if (e?.name === "ENOENT") return null
		else throw e
	}
}

export async function maybeLStat(path: string) {
	try {
		return await lstat(path)
	} catch (e: any) {
		if (e?.name === "ENOENT") return null
		else throw e
	}
}
