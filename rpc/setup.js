'use strict'

const { Replier } = require('./replier')
const {
  worlds,
  current,
  change,
  update
} = require('./calls')

exports.setup = (socket, server) => new Replier(socket, server)
  .replyOn('worlds', worlds)
  .replyOn('current', current)
  .longReplyOn('change', 'changing', 'changed', change)
  .longReplyOn('update', 'updating', 'updated', update)
