const fs = jest.genMockFromModule('fs')
fs.promises = {
	readFile: function() {
		return fs._readFile.apply(null, arguments)
	}
}
module.exports = fs
