'use strict'

const { Replier } = require('./replier')
const {
  worlds,
  current,
  change,
  update,
  create,
  players
} = require('./calls')

exports.setup = (socket, server) => new Replier(socket, server)
  .replyOn('worlds', worlds)
  .replyOn('current', current)
  .longReplyOn('change', 'changing', 'changed', change)
  .longReplyOn('update', 'updating', 'updated', update)
  .longReplyOn('create', 'creating', 'created', create)
  .replyOn('players', players)
