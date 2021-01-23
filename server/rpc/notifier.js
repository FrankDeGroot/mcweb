'use strict'

const { info, log } = require('../utils/log')

exports.Notifier = function (server) {
  this.notify = message => {
    info(message)
    server.emit('message', message)
  }

  this.notifyThrow = async action => {
    try {
      return await action()
    } catch (error) {
      log(error.code ? 'error' : 'info', error)
      server.emit('throw', error.code ? 'An internal error occurred' : error.message)
    }
  }
}
