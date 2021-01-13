'use strict'

import { BusyViewModel } from './busy_view_model.js'
import { ChangeViewModel } from './change/change_view_model.js'
import { CreateViewModel } from './create/create_view_model.js'
import { UpdateViewModel } from './update/update_view_model.js'
import { MessagesViewModel } from './messages/messages_view_model.js'
import { OperatorsViewModel } from './operators/operators_view_model.js'

export function connectedViewModel (changeScheduler) {
  const socket = io()
  const busyViewModel = new BusyViewModel({
    onReady: () => {
      socket.emit('current')
    }
  }, changeScheduler)
  const changeViewModel = new ChangeViewModel({
    onChangeVersionAndWorld: (version, world) => socket.emit('change', {
      version,
      world
    })
  }, changeScheduler)
  const createViewModel = new CreateViewModel({
    onCreateWorld: (version, world, seed) => socket.emit('create', {
      version,
      world,
      seed
    })
  }, changeScheduler)
  const updateViewModel = new UpdateViewModel({
    onUpdateVersion: version => socket.emit('update', { version })
  })
  const messagesViewModel = new MessagesViewModel(changeScheduler)
  const operatorsViewModel = new OperatorsViewModel({}, changeScheduler)
  socket
    .on('message', message => messagesViewModel.pushMessage(message))
    .on('throw', message => messagesViewModel.pushError(message))
    .on('changing', () => {
      busyViewModel.busy = true
    })
    .on('changed', () => {
      busyViewModel.busy = false
    })
    .on('creating', () => {
      busyViewModel.busy = true
    })
    .on('created', () => {
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
      operatorsViewModel.setCurrent(current)
    })
    .emit('current')
  return {
    busyViewModel,
    changeViewModel,
    createViewModel,
    updateViewModel,
    messagesViewModel,
    operatorsViewModel
  }
}
