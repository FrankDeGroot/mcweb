import { Changer } from './change/changer.js'
import { Creator } from './create/creator.js'
import { Gamerules } from './gamerules/gamerules.js'
import { Operators } from './operators/operators.js'
import { Pane } from './pane.js'
import { Scheduler } from './scheduler.js'
import { Updater } from './update/updater.js'
import { connectedViewModel } from './rpc.js'

const changeScheduler = new Scheduler(() => m.redraw())
const {
  changeViewModel,
  createViewModel,
  gamerulesViewModel,
  messagesViewModel,
  operatorsViewModel,
  updateViewModel
} = connectedViewModel(changeScheduler)

m.route(document.body, '/update', {
  '/change': () => Pane(() => m(Changer, { changeViewModel }), messagesViewModel),
  '/create': () => Pane(() => m(Creator, { createViewModel }), messagesViewModel),
  '/gamerules': () => Pane(() => m(Gamerules, { gamerulesViewModel }), messagesViewModel),
  '/operators': () => Pane(() => m(Operators, { operatorsViewModel }), messagesViewModel),
  '/update': () => Pane(() => m(Updater, { updateViewModel }), messagesViewModel)
})
