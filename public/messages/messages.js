export function Messages () {
  return {
    view: vnode => [
      m('label', 'Messages'),
      m('messages', vnode.attrs.messagesViewModel.messages.map(message => m('message', message))),
      m('button', {
        disabled: vnode.attrs.messagesViewModel.noMessages(),
        onclick: e => vnode.attrs.messagesViewModel.clearMessages()
      }, 'Clear')
    ]
  }
}
