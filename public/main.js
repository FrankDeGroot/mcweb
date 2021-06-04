import { Changer } from './change/changer.js'
import { Creator } from './create/creator.js'
import { Gamerules } from './gamerules/gamerules.js'
import { Operators } from './operators/operators.js'
import { Pane } from './pane.js'
import { Scheduler } from './scheduler.js'
import { Updater } from './update/updater.js'
import { connectedViewModel } from './rpc.js'

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
  m.mount(document.body, Pane(getView(), messagesViewModel))
}

function getView () {
  switch (window.location.hash) {
    case '#!/change': return () => m(Changer, { changeViewModel })
    case '#!/create': return () => m(Creator, { createViewModel })
    case '#!/gamerules': return () => m(Gamerules, { gamerulesViewModel })
    case '#!/operators': return () => m(Operators, { operatorsViewModel })
    case '#!/update': return () => m(Updater, { updateViewModel })
  }
}
