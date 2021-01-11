'use strict'

import { BusyViewModel } from './busy_view_model.js'
import { ChangeViewModel } from './change/change_view_model.js'
import { CreateViewModel } from './create/create_view_model.js'
import { UpdateViewModel } from './update/update_view_model.js'
import { MessagesViewModel } from './messages/messages_view_model.js'
import { OpsViewModel } from './ops/ops_view_model.js'

export function connectedViewModel (changeScheduler) {
  const socket = io()
  const handlers = {
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
  const busyViewModel = new BusyViewModel(handlers, changeScheduler)
  const changeViewModel = new ChangeViewModel(handlers, changeScheduler)
  const createViewModel = new CreateViewModel(handlers, changeScheduler)
  const updateViewModel = new UpdateViewModel(handlers)
  const messagesViewModel = new MessagesViewModel(changeScheduler)
  const opsViewModel = new OpsViewModel(handlers, changeScheduler)
  socket
    .on('message', message => messagesViewModel.pushMessage(message))
    .on('throw', message => messagesViewModel.pushError(message))
    .on('changing', () => {
      busyViewModel.busy = true
    })
    .on('changed', () => {
      busyViewModel.busy = false
    })
    .on('updating', () => {
      busyViewModel.busy = true
    })
    .on('updated', () => {
      busyViewModel.busy = false
    })
    .on('current', current => {
      changeViewModel.setCurrent(current)
      createViewModel.setCurrent(current)
      opsViewModel.setCurrent(current)
    })
    .emit('current')
  return {
    busyViewModel,
    changeViewModel,
    createViewModel,
    updateViewModel,
    messagesViewModel,
    opsViewModel
  }
}
