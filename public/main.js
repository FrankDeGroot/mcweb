'use strict'

import { Messages } from './messages.js'
import { Changer } from './changer.js'
import { Versions } from './versions.js'
import { Worlds } from './worlds.js'
import { Updater } from './updater.js'
import { Creator } from './creator.js'
import { connectedViewModel } from './rpc.js'

function Main () {
  const { viewModel, messagesViewModel } = connectedViewModel()
  return {
    view: vnode => [
      m(Versions, { viewModel }),
      m(Updater, { viewModel }),
      m(Worlds, { viewModel }),
      m(Changer, { viewModel }),
      m(Creator, { viewModel }),
      m(Messages, { viewModel: messagesViewModel })
    ]
  }
}
m.mount(document.getElementById('main'), Main)
