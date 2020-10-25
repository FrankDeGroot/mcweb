'use strict'

import { Messages } from './messages.js'
import { Changer } from './changer.js'
import { Versions } from './versions.js'
import { Worlds } from './worlds.js'
import { Updater } from './updater.js'
import { Creator } from './creator.js'
import { connectedViewModel } from './rpc.js'

function Main () {
  const { worldsViewModel, messagesViewModel } = connectedViewModel()
  return {
    view: vnode => [
      m(Versions, { viewModel: worldsViewModel }),
      m(Updater, { viewModel: worldsViewModel }),
      m(Worlds, { viewModel: worldsViewModel }),
      m(Changer, { viewModel: worldsViewModel }),
      m(Creator, { viewModel: worldsViewModel }),
      m(Messages, { viewModel: messagesViewModel })
    ]
  }
}
m.mount(document.getElementById('main'), Main)
