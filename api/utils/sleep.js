'use strict'

exports.sleep = millis => new Promise(resolve => setTimeout(resolve, millis))
