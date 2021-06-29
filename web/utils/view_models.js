import { ChangeViewModel } from '../change/change_view_model.js'
import { CreateViewModel } from '../create/create_view_model.js'
import { GamerulesViewModel } from '../gamerules/gamerules_view_model.js'
import { MessagesViewModel } from '../messages/messages_view_model.js'
import { OperatorsViewModel } from '../operators/operators_view_model.js'
import { UpdateViewModel } from '../update/update_view_model.js'

import { Scheduler } from './scheduler.js'

import { setupStateHandling } from './state_handler.js'

export function createViewModels(redraw) {
  const changeScheduler = new Scheduler(redraw)
  const socket = io()
  socket.on('reload', () => window.location.reload(true))
  const viewModels = {
    changeViewModel: new ChangeViewModel(socket, changeScheduler),
    createViewModel: new CreateViewModel(socket, changeScheduler),
    gamerulesViewModel: new GamerulesViewModel(socket, changeScheduler),
    messagesViewModel: new MessagesViewModel(socket, changeScheduler),
    operatorsViewModel: new OperatorsViewModel(socket, changeScheduler),
    updateViewModel: new UpdateViewModel(socket, changeScheduler)
  }
  setupStateHandling(socket, Object.values(viewModels))
  return viewModels
}