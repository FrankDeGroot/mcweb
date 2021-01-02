'use strict'

import { Nav } from './nav.js'
import { Messages } from './messages.js'
import { Changer } from './changer.js'
import { Updater } from './updater.js'
import { Creator } from './creator.js'
import { Players } from './players.js'
import { connectedViewModel } from './rpc.js'

const { worldsViewModel, messagesViewModel, playersViewModel } = connectedViewModel()

function Pane (content) {
  return {
    view: vnode => [
      m(Nav),
      m('main', [
        content(),
        m(Messages, { viewModel: messagesViewModel })
      ])
    ]
  }
}

m.route(document.getElementsByTagName('body')[0], '/update', {
  '/update': () => Pane(() => m(Updater, { viewModel: worldsViewModel })),
  '/change': () => Pane(() => m(Changer, { viewModel: worldsViewModel })),
  '/create': () => Pane(() => m(Creator, { viewModel: worldsViewModel })),
  '/players': () => Pane(() => m(Players, { viewModel: playersViewModel }))
})
