'use strict'

import { WorldsViewModel } from './worlds_view_model.js'
import { MessagesViewModel } from './messages_view_model.js'

export function connectedViewModel () {
  const socket = io()
  const handlers = {
    onChange: () => {
      m.redraw()
    },
    onChangeVersion: version => {
      socket.emit('worlds', version)
    },
    onReady: () => {
      socket.emit('current')
    },
    onUpdateVersion: version => socket.emit('update', { version }),
    onChangeVersionAndWorld: (version, world) => socket.emit('change', {
      version,
      world
    }),
    onCreateWorld: (version, world, seed) => socket.emit('create', {
      version,
      world,
      seed
    })
  }
  const worldsViewModel = new WorldsViewModel(handlers)
  const messagesViewModel = new MessagesViewModel(handlers)
  socket
    .on('message', message => messagesViewModel.pushMessage(message))
    .on('throw', message => messagesViewModel.pushError(message))
    .on('changing', () => {
      worldsViewModel.busy = true
    })
    .on('changed', () => {
      worldsViewModel.busy = false
    })
    .on('updating', () => {
      worldsViewModel.busy = true
    })
    .on('updated', () => {
      worldsViewModel.busy = false
    })
    .on('current', response => worldsViewModel.loadVersionAndWorld(response))
    .on('worlds', response => worldsViewModel.loadWorld(response))
    .emit('current')

  return { worldsViewModel, messagesViewModel }
}
