let _basePath = "mc"

export default {
	get basePath() {
		return _basePath
	},
	set basePath(value) {
		_basePath = value
	}
}