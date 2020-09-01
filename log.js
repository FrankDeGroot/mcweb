'use strict'

const levels = ['trace', 'info', 'warning', 'error']
var min = 0

exports.log = log
exports.level = level => min = minLevel(level)
for(const level of levels) {
	exports[level] = (...args) => log(level, ...args)
}

function log(level, ...args) {
	if (minLevel(level) >= min) console[level](new Date().toISOString(), level, ...args)
}

function minLevel(level) {
	return levels.indexOf(level)
}