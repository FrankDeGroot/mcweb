'use strict'

module.exports = {
  transform: {
    '.*/web(\\.test)?/.*\\.js': 'babel-jest',
    '.*\\.mjs': 'babel-jest'
  }
}
