import { ViewModelFactory } from './utils/view_model_factory.js'

import { ChangeView } from './change/change_view.js'
import { CreateView } from './create/create_view.js'
import { GamerulesView } from './gamerules/gamerules_view.js'
import { MessagesView } from './messages/messages_view.js'
import { OperatorsView } from './operators/operators_view.js'
import { UpdateView } from './update/update_view.js'

const socket = io()
socket.on('reload', () => window.location.reload(true))
const viewModelFactory = new ViewModelFactory(socket, redraw)
const items = [
  UpdateView,
  ChangeView,
  CreateView,
  GamerulesView,
  OperatorsView
]
const messagesView = new MessagesView(viewModelFactory.createViewModel(MessagesView.ViewModel))
const menu = items.map(({ hash, name }) => {
  return { hash, name }
})
const views = items.reduce((views, View) => {
  views[View.hash] = new View(viewModelFactory.createViewModel(View.ViewModel))
  return views
}, {})
window.onhashchange = redraw

function redraw() {
  uhtml.render(document.body, pane(views[currentHash()].render(), messagesView.render()))
}

function pane(content, messages) {
  return uhtml.html`${nav()}<main>${content}${messages}</main>`
}

function nav() {
  return uhtml.html`<nav>${menu.map(item)}</nav>`
}

function item({ hash, name }) {
  return currentHash() === hash
    ? uhtml.html`<div>${name}</div>`
    : uhtml.html`<a href=${hash}>${name}</a>`
}

function currentHash() {
  return window.location.hash || menu[0].hash
}
