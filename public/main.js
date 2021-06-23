import { changer } from './change/changer.js'
import { creator } from './create/creator.js'
import { gamerules } from './gamerules/gamerules.js'
import { messages } from './messages/messages.js'
import { operators } from './operators/operators.js'
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

function redraw () {
  uhtml.render(document.body, pane(getView(), messages(messagesViewModel)))
}

function getView () {
  switch (window.location.hash) {
    case '#!/change': return changer(changeViewModel)
    case '#!/create': return creator(createViewModel)
    case '#!/gamerules': return gamerules(gamerulesViewModel)
    case '#!/operators': return operators(operatorsViewModel)
    case '#!/update': return updateView(updateViewModel)
  }
}
