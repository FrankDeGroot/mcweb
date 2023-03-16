let _manifestUrl = "https://launchermeta.mojang.com/mc/game/version_manifest.json"

export default {
	get manifestUrl() {
		return _manifestUrl
	},
	set manifestUrl(value) {
		_manifestUrl = value
	}
}