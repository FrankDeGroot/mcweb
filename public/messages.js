'use strict'

export function Messages () {
  return {
    view: vnode => [
      m('label', 'Messages'),
      m('messages', vnode.attrs.viewModel.messages.map(message => m('message', message))),
      m('button', {
        disabled: vnode.attrs.viewModel.noMessages(),
        onclick: e => vnode.attrs.viewModel.clearMessages()
      }, 'Clear')
    ]
  }
}
