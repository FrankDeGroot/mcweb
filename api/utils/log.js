'use strict'

const levels = ['trace', 'info', 'warn', 'error']
let min = 0

exports.log = log
exports.level = level => {
  min = minLevel(level)
}
exports.trace = (...args) => log('trace', ...args)
exports.info = (...args) => log('info', ...args)
exports.warn = (...args) => log('warn', ...args)
exports.error = (...args) => log('error', ...args)

function log(level, ...args) {
  if (minLevel(level) >= min) console[level](new Date().toISOString(), level, ...args)
}

function minLevel(level) {
  return levels.indexOf(level)
}
