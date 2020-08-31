'use strict'

const levels = ['trace', 'info', 'warning', 'error']
var min = 0

exports.log = log
exports.level = level => min = levels.indexOf(level)
for(const level of levels) {
	exports[level] = (...args) => log(level, ...args)
}

function log(level, ...args) {
	if (levels.indexOf(level) >= min) console[level](new Date().toISOString(), level, ...args)
}