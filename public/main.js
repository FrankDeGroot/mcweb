'use strict'

import { Scheduler } from './scheduler.js'
import { Changer } from './change/changer.js'
import { Creator } from './create/creator.js'
import { Updater } from './update/updater.js'
import { Operators } from './operators/operators.js'
import { Pane } from './pane.js'
import { connectedViewModel } from './rpc.js'

const changeScheduler = new Scheduler(() => m.redraw())
const {
  changeViewModel,
  createViewModel,
  updateViewModel,
  messagesViewModel,
  operatorsViewModel
} = connectedViewModel(changeScheduler)

m.route(document.body, '/update', {
  '/change': () => Pane(() => m(Changer, { changeViewModel }), messagesViewModel),
  '/create': () => Pane(() => m(Creator, { createViewModel }), messagesViewModel),
  '/update': () => Pane(() => m(Updater, { updateViewModel }), messagesViewModel),
  '/operators': () => Pane(() => m(Operators, { operatorsViewModel }), messagesViewModel)
})
