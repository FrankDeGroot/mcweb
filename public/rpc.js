'use strict'

import { ChangeViewModel } from './change/change_view_model.js'
import { CreateViewModel } from './create/create_view_model.js'
import { UpdateViewModel } from './update/update_view_model.js'
import { MessagesViewModel } from './messages/messages_view_model.js'
import { OperatorsViewModel } from './operators/operators_view_model.js'

export function connectedViewModel (changeScheduler) {
  let state = {}
  const socket = io()
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
  function setState () {
    changeViewModel.setCurrent(state)
    createViewModel.setCurrent(state)
    updateViewModel.setCurrent(state)
    operatorsViewModel.setCurrent(state)
  }
  socket
    .on('message', message => messagesViewModel.pushMessage(message))
    .on('throw', message => messagesViewModel.pushError(message))
    .on('current', current => {
      state = current
      setState()
    })
    .on('changed', changed => {
      state = { ...state, ...changed }
      setState()
    })
  return {
    changeViewModel,
    createViewModel,
    updateViewModel,
    messagesViewModel,
    operatorsViewModel
  }
}
