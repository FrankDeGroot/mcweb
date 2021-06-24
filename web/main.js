import { changeView } from './change/change_view.js'
import { createView } from './create/create_view.js'
import { gamerulesView } from './gamerules/gamerules_view.js'
import { messagesView } from './messages/messages_view.js'
import { operatorsView } from './operators/operators_view.js'
import { pane } from './pane.js'
import { Scheduler } from './scheduler.js'
import { updateView } from './update/update_view.js'
import { connectedViewModel } from './rpc.js'

self._ = uhtml.html

const changeScheduler = new Scheduler(redraw)
const {
  changeViewModel,
  createViewModel,
  gamerulesViewModel,
  messagesViewModel,
  operatorsViewModel,
  updateViewModel
} = connectedViewModel(changeScheduler)

window.onhashchange = redraw

function redraw() {
  uhtml.render(document.body, pane(getView(), messagesView(messagesViewModel)))
}

function getView() {
  switch (window.location.hash) {
    case '#!/change': return changeView(changeViewModel)
    case '#!/create': return createView(createViewModel)
    case '#!/gamerules': return gamerulesView(gamerulesViewModel)
    case '#!/operators': return operatorsView(operatorsViewModel)
    case '#!/update': return updateView(updateViewModel)
  }
}