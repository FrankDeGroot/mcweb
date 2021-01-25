'use strict'

import { ChangeViewModel } from './change/change_view_model.js'
import { CreateViewModel } from './create/create_view_model.js'
import { UpdateViewModel } from './update/update_view_model.js'
import { MessagesViewModel } from './messages/messages_view_model.js'
import { OperatorsViewModel } from './operators/operators_view_model.js'
import { setupState } from './state.js'

export function connectedViewModel (changeScheduler) {
  const socket = io()
  const viewModels = {
    changeViewModel: new ChangeViewModel(socket, changeScheduler),
    createViewModel: new CreateViewModel(socket, changeScheduler),
    updateViewModel: new UpdateViewModel(socket, changeScheduler),
    operatorsViewModel: new OperatorsViewModel(socket, changeScheduler),
    messagesViewModel: new MessagesViewModel(socket, changeScheduler)
  }
  setupState(socket, viewModels)
  return viewModels
}
