'use strict'

import { ChangeViewModel } from './change/change_view_model.js'
import { CreateViewModel } from './create/create_view_model.js'
import { UpdateViewModel } from './update/update_view_model.js'
import { MessagesViewModel } from './messages/messages_view_model.js'
import { OperatorsViewModel } from './operators/operators_view_model.js'

export function connectedViewModel (changeScheduler) {
  let state = {}
  const socket = io()
  const viewModels = {
    changeViewModel: new ChangeViewModel(socket, changeScheduler),
    createViewModel: new CreateViewModel(socket, changeScheduler),
    updateViewModel: new UpdateViewModel(socket, changeScheduler),
    operatorsViewModel: new OperatorsViewModel(socket, changeScheduler),
    messagesViewModel: new MessagesViewModel(socket, changeScheduler)
  }
  function setState () {
    Object.values(viewModels).map(viewModel => viewModel.setCurrent(state))
  }
  socket
    .on('current', current => {
      state = current
      setState()
    })
    .on('changed', changed => {
      state = { ...state, ...changed }
      setState()
    })
  return viewModels
}
