'use strict'

import { Messages } from './messages.js'
import { Changer } from './changer.js'
import { Versions } from './versions.js'
import { Worlds } from './worlds.js'
import { Updater } from './updater.js'
import { Creator } from './creator.js'
import { ViewModel } from './view_model.js'

function Main () {
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
    onCreateWorld: (version, seed, name) => socket.emit('create', {
      version,
      seed,
      name
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
  return {
    view: vnode => [
      m(Versions, { viewModel }),
      m(Updater, { viewModel }),
      m(Worlds, { viewModel }),
      m(Changer, { viewModel }),
      m(Creator, { viewModel }),
      m(Messages, { viewModel })
    ]
  }
}
m.mount(document.getElementById('main'), Main)
