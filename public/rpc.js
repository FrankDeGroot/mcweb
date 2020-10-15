'use strict'

import { ViewModel } from './view_model.js'

export function connectedViewModel () {
  const socket = io()
  const viewModel = new ViewModel({
    onChange: () => {
      m.redraw()
    },
    onChangeVersion: version => {
      socket.emit('worlds', version)
    },
    onChangeWorld: world => {},
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
  })
  socket
    .on('message', message => viewModel.pushMessage(message))
    .on('throw', message => viewModel.pushError(message))
    .on('changing', () => {
      viewModel.busy = true
    })
    .on('changed', () => {
      viewModel.busy = false
    })
    .on('updating', () => {
      viewModel.busy = true
    })
    .on('updated', () => {
      viewModel.busy = false
    })
    .on('current', response => viewModel.loadVersionAndWorld(response))
    .on('worlds', response => viewModel.loadWorld(response))
    .emit('current')

  return viewModel
}
