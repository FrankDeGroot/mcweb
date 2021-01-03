'use strict'

import { Changer } from './change/changer.js'
import { Creator } from './create/creator.js'
import { Updater } from './update/updater.js'
import { Ops } from './ops/ops.js'
import { Pane } from './pane.js'
import { connectedViewModel } from './rpc.js'

const {
  busyViewModel,
  changeViewModel,
  createViewModel,
  updateViewModel,
  messagesViewModel,
  opsViewModel
} = connectedViewModel()

m.route(document.body, '/update', {
  '/change': () => Pane(() => m(Changer, { busyViewModel, changeViewModel }), messagesViewModel),
  '/create': () => Pane(() => m(Creator, { busyViewModel, createViewModel }), messagesViewModel),
  '/update': () => Pane(() => m(Updater, { busyViewModel, updateViewModel }), messagesViewModel),
  '/ops': () => Pane(() => m(Ops, { busyViewModel, opsViewModel }), messagesViewModel)
})
