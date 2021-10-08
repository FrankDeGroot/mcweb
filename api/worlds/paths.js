import { join } from 'path'
import { mcPath } from '../../all/config.js'

const currentVersionName = 'current'
const currentWorldName = 'world'

export function getVersionPath(version) {
	return join(mcPath, version)
}

export function getWorldPath(version, world) {
	return join(getVersionPath(version), world)
}

export function getCurrentVersionPath() {
	return getVersionPath(currentVersionName)
}

export function getCurrentWorldPath(version) {
	return join(getVersionPath(version), currentWorldName)
}

export function getServerPath() {
	return mcPath
}

export function getCommonPath() {
	return join(mcPath, 'common')
}
