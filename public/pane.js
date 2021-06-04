import { Nav } from './nav.js'
import { Messages } from './messages/messages.js'

export function Pane (content, messagesViewModel) {
  return {
    view: vnode => [
      m(Nav),
      m('main', [
        content(),
        m(Messages, { messagesViewModel })
      ])
    ]
  }
}
