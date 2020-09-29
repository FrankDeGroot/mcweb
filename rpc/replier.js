'use strict'

const { info, log } = require('./../log')

exports.Replier = function (socket, server) {
  function notify (message) {
    info(message)
    server.emit('message', message)
  }

  async function longReply (doing, done, action) {
    server.emit(doing)
    try {
      await action()
    } catch (err) {
      replyError(server, err)
    } finally {
      server.emit(done)
    }
  }

  async function reply (name, getReply) {
    try {
      socket.emit(name, await getReply())
    } catch (err) {
      replyError(socket, err)
    }
  }

  function replyError (emitter, err) {
    log(err.code ? 'error' : 'info', err)
    emitter.emit('throw', err.code ? 'An internal error occurred' : err.message)
  }

  this.replyOn = (name, handler) => {
    socket.on(name, (...args) =>
      reply(name, () => handler(...args)))
    return this
  }

  this.longReplyOn = (name, doing, done, handler) => {
    socket.on(name, (...args) =>
      longReply(doing, done, () => handler(notify, ...args)))
    return this
  }
}
