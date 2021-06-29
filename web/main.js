import { createViewModels } from './utils/view_models.js'
// import { pane } from './pane_view.js'

import { changeView } from './change/change_view.js'
import { createView } from './create/create_view.js'
import { gamerulesView } from './gamerules/gamerules_view.js'
import { messagesView } from './messages/messages_view.js'
import { operatorsView } from './operators/operators_view.js'
import { updateView } from './update/update_view.js'

self._ = uhtml.html

function redraw() {
  uhtml.render(document.body, pane(views[currentHash()](), messagesView(messagesViewModel)))
}

const {
  changeViewModel,
  createViewModel,
  gamerulesViewModel,
  messagesViewModel,
  operatorsViewModel,
  updateViewModel
} = createViewModels(redraw)
const items = [
  { hash: '#!/update', name: 'Update Server', view: () => updateView(updateViewModel) },
  { hash: '#!/change', name: 'Change World', view: () => changeView(changeViewModel) },
  { hash: '#!/create', name: 'Create World', view: () => createView(createViewModel) },
  { hash: '#!/gamerules', name: 'Gamerules', view: () => gamerulesView(gamerulesViewModel) },
  { hash: '#!/operators', name: 'Set Operators', view: () => operatorsView(operatorsViewModel) }
]
const menu = items.map(({ hash, name }) => {
  return { hash, name }
})
const views = items.reduce((v, { hash, view }) => {
  v[hash] = view
  return v
}, {})
window.onhashchange = redraw

function pane(content, messages) {
  return _`${nav()}<main>${content}${messages}</main>`
}

function nav() {
  return _`<nav>${menu.map(item)}</nav>`
}

function item({ hash, name }) {
  return currentHash() === hash
    ? _`<div>${name}</div>`
    : _`<a href=${hash}>${name}</a>`
}

function currentHash() {
  return window.location.hash || menu[0].hash
}
